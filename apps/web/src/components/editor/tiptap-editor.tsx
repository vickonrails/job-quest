
import { TextAlign } from '@tiptap/extension-text-align'
import { EditorContent, useEditor, type EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useId, type ReactNode } from 'react'
import { Label } from 'ui/label'
import { EditorMenu } from './editor-header'

interface TipTapProps {
    value?: string
    label?: ReactNode
    onChange?: (text: string) => void
}

export function Editor({ value, label, onChange }: TipTapProps) {
    const id = useId()

    const onUpdate = useCallback(({ editor }: EditorEvents['update']) => {
        if (!editor) return
        onChange?.(editor.getHTML())
    }, [onChange])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right']
            })
        ],
        onUpdate: onUpdate,
        editorProps: {
            attributes: {
                class: 'border list-disc border-t-0 rounded-none text-sm text-accent-foreground p-3 leading-7 max-h-36 overflow-auto',
                id
            }
        },

        content: value ?? ''
    })

    return (
        <>
            {label && <Label onClick={() => editor?.chain().focus()} htmlFor={id}>{label}</Label>}
            <div className="tiptap-editor">
                <EditorMenu editor={editor} />
                <EditorContent editor={editor} id={id} />
            </div>
        </>
    )
}