import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import JsonView from '@uiw/react-json-view';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';

export function CodeBlock({ value }: { value: object }) {
    const { theme, systemTheme } = useTheme()

    const styleTheme = useMemo(() => {
        let themeValue;
        if (theme === 'light' || theme === 'dark') {
            themeValue = theme
        } else {
            themeValue = systemTheme
        }
        return themeValue === 'dark' ? githubDarkTheme : githubLightTheme
    }, [theme, systemTheme])

    return (
        <JsonView value={value} style={styleTheme} />
    )
}