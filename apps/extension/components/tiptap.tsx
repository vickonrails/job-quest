import { BubbleMenu, EditorProvider, type Content, Editor, type EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const extensions = [
    StarterKit.configure({
        listItem: {
            HTMLAttributes: {
                class: 'ml-3 mb-1 list-disc'
            }
        }
    })
]

const Tiptap = ({ content, onChange }: { content: Content, onChange: (val: string) => void }) => {
    // might need to memoize this
    const handleOnUpdate = ({ editor }: EditorEvents['update']) => {
        onChange(editor.getHTML())
    }

    return (
        <EditorProvider
            extensions={extensions}
            content={content}
            onUpdate={handleOnUpdate}
            editorProps={{
                attributes: {
                    class: 'border rounded-sm text-sm text-accent-foreground p-3 leading-7'
                }
            }}>
            <BubbleMenu>Content of the floating menu</BubbleMenu>
        </EditorProvider>
    )
}

export default Tiptap