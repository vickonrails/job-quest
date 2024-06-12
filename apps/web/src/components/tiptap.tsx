import { EditorContent, useEditor, type Editor, type EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold } from 'lucide-react'
import { type ReactNode, useId, useCallback } from 'react'
import { Label } from 'ui/label'

interface TipTapProps {
    value?: string
    label?: ReactNode
    onChange?: (text: string) => void
}

export function TipTap({ value, label, onChange }: TipTapProps) {
    const id = useId()

    const onUpdate = useCallback(({ editor }: EditorEvents['update']) => {
        if (!editor) return
        onChange?.(editor.getHTML())
    }, [onChange])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false
            })
        ],
        onUpdate: onUpdate,
        editorProps: {
            attributes: {
                class: 'border border-t-0 text-sm text-accent-foreground p-3 leading-7',
                id
            }
        },

        content: value ?? ''
    })

    return (
        <>
            {label && <Label htmlFor={id}>{label}</Label>}
            <div>
                <EditorContent editor={editor} id={id} />
            </div>
        </>
    )
}

function EditorMenu({ editor }: { editor: Editor | null }) {
    if (!editor) return null

    return (
        <header className="border shadow-sm">
            <button onClick={() => editor.chain().toggleBold().run()} type="button"><Bold /></button>
        </header>
    )
}