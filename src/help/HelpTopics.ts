import fs from 'fs'
import path from 'path'

function gatherDocs(): HelpTopic[] {
    const docs = fs.readdirSync('docs')
    const topics = []
    docs.forEach(doc => {
        const json = JSON.parse(fs.readFileSync(path.join('docs', doc), 'utf8'))

        const obj: HelpTopic = {
            helpText: json.helpText,
            description: json.description,
            topicName: doc.replace('.json', ''),
        }
        topics.push(obj)
    })

    return topics
}

export default gatherDocs()
export interface HelpTopic {
    topicName: string;
    helpText: string;
    description: string;
}

