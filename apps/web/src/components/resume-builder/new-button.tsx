'use client'

import React from 'react'
import { Button } from 'ui/button'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'

export default function NewButton() {
    const router = useRouter()
    const handleCreateNew = () => {
        const newId = uuid();
        router.push(`/resumes/${newId}`);
    }

    return (
        <Button onClick={handleCreateNew}>
            Create New
        </Button>
    )
}
