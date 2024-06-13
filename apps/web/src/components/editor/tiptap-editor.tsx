
import { TextAlign } from '@tiptap/extension-text-align'
import { EditorContent, useEditor, type EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useId, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from 'shared'
import { Label } from 'ui/label'
import { EditorMenu } from './editor-header'

interface TipTapProps {
    value?: string
    label?: ReactNode
    onChange?: (text: string) => void
    className?: string
    containerProps?: HTMLAttributes<HTMLElement>
}

export function Editor({ value, label, onChange, containerProps, className }: TipTapProps) {
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
                class: cn('border list-disc border-t-0 rounded-none text-sm text-accent-foreground p-3 leading-7 overflow-auto w-full', className),
                id
            }
        },

        content: value ?? ''
    })

    const containerClassName = containerProps?.className

    return (
        <>
            {label && <Label onClick={() => editor?.chain().focus()} htmlFor={id}>{label}</Label>}
            <div className={cn('tiptap-editor flex flex-col w-full h-full', containerClassName)}>
                <EditorMenu editor={editor} />
                <EditorContent className="flex-1 overflow-auto" editor={editor} id={id} />
            </div>
        </>
    )
}