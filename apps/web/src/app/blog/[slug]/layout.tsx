import { Footer } from '@/components/landing-page/header';
import { Nav } from '@/components/landing-page/landing-page-nav';
import React from 'react';

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="max-w-7xl mx-auto container pt-4">
            <Nav />
            <main className="max-w-3xl mx-auto min-h-full">{children}</main>
            <Footer />
        </section>
    )
}