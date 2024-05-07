import { renderHook, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import { describe } from 'vitest'
import { useCoverLetter } from '../../src/hooks/useCoverLetter'
import { coverLetter, job, user } from '../utils'

describe('useCoverLetter', () => {
    it('Updates', async () => {
        const { result } = renderHook(() => useCoverLetter({ job, coverLetter, user }))
        expect(result.current.value).toBe('')
        act(() => {
            result.current.setValue('Hello World')
        });
        await waitFor(() => {
            expect(result.current.value).toBe('Hello World');
        });
    })
});