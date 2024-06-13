
import { type Editor as EditorProps } from '@tiptap/react'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, List, Strikethrough } from 'lucide-react'
import { type HTMLAttributes } from 'react'
import { cn } from 'shared'

export interface EditorHeaderProps {
    editor: EditorProps | null
    Right?: React.ReactNode
}

export function EditorHeader({ editor, Right }: EditorHeaderProps) {
    if (!editor) return null

    return (
        <header className="border flex justify-between items-center shadow-sm p-2">
            <section className="flex gap-2">
                <section className="flex gap-1 border-r pr-2">
                    <EditorHeaderButton
                        editor={editor}
                        name="bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold size={14} />
                    </EditorHeaderButton>

                    <EditorHeaderButton
                        editor={editor}
                        name="italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic size={14} />
                    </EditorHeaderButton>

                    <EditorHeaderButton
                        editor={editor}
                        name="strike"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough size={14} />
                    </EditorHeaderButton>
                </section>

                <section className="flex gap-1 border-r pr-2">
                    <EditorHeaderButton
                        editor={editor}
                        name={{ textAlign: 'left' }}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    >
                        <AlignLeft size={14} />
                    </EditorHeaderButton>

                    <EditorHeaderButton
                        editor={editor}
                        name={{ textAlign: 'center' }}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    >
                        <AlignCenter size={14} />
                    </EditorHeaderButton>

                    <EditorHeaderButton
                        editor={editor}
                        name={{ textAlign: 'right' }}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    >
                        <AlignRight size={14} />
                    </EditorHeaderButton>
                </section>

                <section>
                    <EditorHeaderButton
                        editor={editor}
                        name="bulletList"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List size={14} />
                    </EditorHeaderButton>
                </section>
            </section>

            <section>
                {Right}
            </section>
        </header>
    )
}

interface EditorHeaderButtonProps extends HTMLAttributes<HTMLButtonElement> {
    editor: EditorProps | null
    name: string | Record<string, unknown>
}

function EditorHeaderButton({ editor, children, className, name, ...rest }: EditorHeaderButtonProps) {
    if (!editor) return null

    return (
        <button
            className={cn(
                'p-2 hover:bg-accent border-transparent rounded-md border',
                editor.isActive(name) && 'border-border',
                className
            )} type="button"
            {...rest}
        >
            {children}
        </button>
    )
}