import React from 'react'
import { describe } from 'vitest';
import { cleanup, render } from '@testing-library/react'
import { Avatar, type AvatarProps } from '@/components/avatar'

describe('Avatar', () => {
    afterEach(() => {
        cleanup();
    })

    const setup = (props: AvatarProps) => {
        return render(
            <Avatar {...props} />
        )
    }

    it('renders the correct size', () => {
        const imgUrl = 'https://avatars.githubusercontent.com/u/24235881?v=4'
        const lgAvatar = setup({ size: 'lg', alt: 'lg', src: imgUrl })
        const smAvatar = setup({ size: 'sm', alt: 'sm', src: imgUrl })

        expect(lgAvatar.getByRole('img', { name: 'lg' })).toHaveClass('h-12 w-12')
        expect(smAvatar.getByRole('img', { name: 'sm' })).toHaveClass('h-8 w-8')
    });

    it('renders the fallback when no src is passed', () => {
        const { getByText } = setup({ alt: '', fallbackText: 'John Doe' });
        expect(getByText('JD')).toBeInTheDocument();
    });
})