import fs from 'fs'
import path from 'path'

export interface HelpTopic {
    hint: string;
    topicName: string;
    helpText: string;
    description: string;
}


export class Topics {

    static items(): HelpTopic[] {
        const topics: HelpTopic[] = []

        const docs = fs.readdirSync(path.join('docs'))

        for (const doc of docs) {
            const text = fs.readFileSync(path.join('docs', doc), 'utf-8')
            const split = text.split('---')

            topics.push({
                description: split[0],
                helpText: split[1],
                hint: split[2],
                topicName: doc.replace('.md', '').replaceAll('-', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
            })
        }

        return topics

    }

    static categories(): string[] {
        return fs.readdirSync('docs')
    }
}
