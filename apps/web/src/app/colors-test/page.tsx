'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ColorsTest() {
    return (
        <div className='min-h-screen bg-background p-8'>
            <div className='max-w-7xl mx-auto space-y-8'>
                <div className='text-center space-y-4'>
                    <h1 className='text-4xl font-bold text-foreground'>PlayerTracker - Athletic Balance Palette</h1>
                    <p className='text-xl text-muted-foreground'>
                        Orange (Performance) • Teal (Wellness) • Violet (Innovation)
                    </p>
                </div>

                {/* Primary Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Primary Colors - Performance</CardTitle>
                        <CardDescription>Orange (#FC4C02 light / #FF6B35 dark) - Energy & Action</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <Button variant='default' size='lg'>
                                Primary Button
                            </Button>
                            <Button variant='default' size='lg' className='opacity-90'>
                                Primary Hover
                            </Button>
                            <Button variant='default' size='lg' disabled>
                                Primary Disabled
                            </Button>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            <Badge className='bg-primary text-primary-foreground'>Performance</Badge>
                            <Badge className='bg-primary text-primary-foreground'>Physical Metrics</Badge>
                            <Badge className='bg-primary text-primary-foreground'>Action Required</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Secondary Colors - Wellness</CardTitle>
                        <CardDescription>Teal (#177E89 light / #1A95A3 dark) - Mental Balance</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <Button variant='secondary' size='lg'>
                                Secondary Button
                            </Button>
                            <Button variant='secondary' size='lg' className='opacity-90'>
                                Secondary Hover
                            </Button>
                            <Button variant='secondary' size='lg' disabled>
                                Secondary Disabled
                            </Button>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            <Badge className='bg-secondary text-secondary-foreground'>Wellness</Badge>
                            <Badge className='bg-secondary text-secondary-foreground'>Mental Health</Badge>
                            <Badge className='bg-secondary text-secondary-foreground'>Recovery</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Accent Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Accent Colors - Innovation</CardTitle>
                        <CardDescription>Violet (#8338EC light / #9B5CFF dark) - Community & Tech</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <Button
                                variant='default'
                                size='lg'
                                className='bg-accent text-accent-foreground hover:bg-accent/90'
                            >
                                Accent Button
                            </Button>
                            <Button
                                variant='outline'
                                size='lg'
                                className='border-accent text-accent hover:bg-accent hover:text-accent-foreground'
                            >
                                Accent Outline
                            </Button>
                            <Button
                                variant='ghost'
                                size='lg'
                                className='text-accent hover:bg-accent hover:text-accent-foreground'
                            >
                                Accent Ghost
                            </Button>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            <Badge className='bg-accent text-accent-foreground'>Community</Badge>
                            <Badge className='bg-accent text-accent-foreground'>Social</Badge>
                            <Badge className='bg-accent text-accent-foreground'>Innovation</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Semantic Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Semantic Colors</CardTitle>
                        <CardDescription>
                            Success (Green) • Warning (Yellow) • Error (Red) • Info (Blue)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='p-4 bg-green-500 text-white rounded-lg'>
                                <h3 className='font-bold'>Success</h3>
                                <p className='text-sm'>#00B894 - Health & Progress</p>
                            </div>
                            <div className='p-4 bg-yellow-500 text-white rounded-lg'>
                                <h3 className='font-bold'>Warning</h3>
                                <p className='text-sm'>#FFC857 - Energy & Attention</p>
                            </div>
                            <div className='p-4 bg-destructive text-destructive-foreground rounded-lg'>
                                <h3 className='font-bold'>Error</h3>
                                <p className='text-sm'>#DB3A34 - Alert & Danger</p>
                            </div>
                            <div className='p-4 bg-blue-500 text-white rounded-lg'>
                                <h3 className='font-bold'>Info</h3>
                                <p className='text-sm'>#3A86FF - Information</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cards Showcase */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card className='border-primary'>
                        <CardHeader>
                            <CardTitle className='text-primary'>Performance Card</CardTitle>
                            <CardDescription>Physical metrics and stats</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Speed</span>
                                    <span className='font-bold text-primary'>24 km/h</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Distance</span>
                                    <span className='font-bold text-primary'>5.2 km</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-secondary'>
                        <CardHeader>
                            <CardTitle className='text-secondary'>Wellness Card</CardTitle>
                            <CardDescription>Mental health tracking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Mood</span>
                                    <span className='font-bold text-secondary'>Good</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Stress</span>
                                    <span className='font-bold text-secondary'>Low</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='border-accent'>
                        <CardHeader>
                            <CardTitle className='text-accent'>Community Card</CardTitle>
                            <CardDescription>Team activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Team</span>
                                    <span className='font-bold text-accent'>Active</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-muted-foreground'>Members</span>
                                    <span className='font-bold text-accent'>24</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Text Hierarchy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Typography & Hierarchy</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <h1 className='text-4xl font-bold text-foreground'>Heading 1 - Foreground</h1>
                            <h2 className='text-3xl font-semibold text-foreground'>Heading 2 - Foreground</h2>
                            <h3 className='text-2xl font-medium text-foreground'>Heading 3 - Foreground</h3>
                            <p className='text-base text-foreground'>Body text - Primary foreground color</p>
                            <p className='text-sm text-muted-foreground'>Secondary text - Muted foreground color</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <Card className='bg-muted'>
                    <CardContent className='p-6 text-center'>
                        <p className='text-muted-foreground'>Toggle dark mode to see the palette adapt automatically</p>
                        <p className='text-sm text-muted-foreground mt-2'>
                            Light: Pure white (#FFFFFF) • Dark: Material Design (#121212)
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
