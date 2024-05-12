import React from 'react'
import { Button } from 'ui/button'

export default function JobsEditSheetButton() {
    return (
        <Button type="submit">{entity ? 'Update' : 'Create'}</Button>
    )
}
