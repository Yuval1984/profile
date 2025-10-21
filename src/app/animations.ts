import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';

export const slideInLeft = trigger('slideInLeft', [
    state('hidden', style({
        opacity: 0,
        transform: 'translateX(-80px)'
    })),
    state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
    })),
    transition('hidden => visible', [
        style({ opacity: 0, transform: 'translateX(-80px)' }),
        animate(
            '800ms {{delay}} cubic-bezier(0.35, 0, 0.25, 1)',
            style({ opacity: 1, transform: 'translateX(0)' })
        )
    ], { params: { delay: '0ms' } })
]);

export const scaleInFade = trigger('scaleInFade', [
    state('hidden', style({
        opacity: 0,
        transform: 'scale(0.8)'
    })),
    state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
    })),
    transition('hidden => visible', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate(
            '1000ms {{delay}} cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'scale(1)' })
        )
    ], { params: { delay: '0ms' } })
]);

export const slideInRight = trigger('slideInRight', [
    state('hidden', style({ opacity: 0, transform: 'translateX(80px)' })),
    state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
    transition('hidden => visible', animate('800ms cubic-bezier(0.35, 0, 0.25, 1)'))
]);

export const fadeInUp = trigger('fadeInUp', [
    state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px)',
        visibility: 'hidden'
    })),
    state('visible', style({
        opacity: 1,
        transform: 'translateY(0)',
        visibility: 'visible'
    })),
    transition('hidden => visible', [
        style({ opacity: 0, transform: 'translateY(20px)', visibility: 'visible' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
        )
    ])
]);

export const typewriter = trigger('typewriter', [
    transition('* => *', [
        query(':enter', [
            style({ width: 0, opacity: 0 }),
            stagger(50, [
                animate('{{duration}}ms ease', keyframes([
                    style({ opacity: 1, offset: 0 }),
                    style({ width: '*', offset: 1 })
                ]))
            ])
        ], { optional: true })
    ])
]);

export const longTypewriter = trigger('longTypewriter', [
    transition('hidden => visible', [
        // Container animation
        style({ opacity: 0 }),
        animate('300ms ease', style({ opacity: 1 })),

        // Characters animation
        query('.typewriter-char', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(30, [
                animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ], { optional: true })
    ])
]);

export const trainAnimation = trigger('trainAnimation', [
    state('hidden', style({
        opacity: 0,
        transform: 'translateX(100vw)'
    })),
    state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
    })),
    transition('hidden => visible', [
        animate('{{duration}}ms {{delay}}ms cubic-bezier(0.4, 0.0, 0.2, 1)')
    ])
]);

export const experienceAnimation = trigger('experienceAnimation', [
    state('hidden', style({
        opacity: 0,
        transform: 'translateX({{startX}}) translateY(20px)'
    }), { params: { startX: '-80px' } }),
    state('visible', style({
        opacity: 1,
        transform: 'translateX(0) translateY(0)'
    })),
    transition('hidden => visible', [
        animate('800ms cubic-bezier(0.35, 0, 0.25, 1)')
    ])
]);

export const portfolioAnimation = trigger('portfolioAnimation', [
    state('hidden', style({
        opacity: 0,
        transform: 'translateX({{startX}})'
    }), { params: { startX: '-100%' } }),
    state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
    })),
    transition('hidden => visible', [
        animate('600ms {{delay}} cubic-bezier(0.35, 0, 0.25, 1)')
    ], { params: { delay: '0ms' } })
]);

export const slideInSide = trigger('slideInSide', [
    state('hidden', style({
        opacity: 0,
        transform: '{{fromLeft}} ? translateX(-100vw) : translateX(100vw)'
    }), { params: { fromLeft: true } }),
    state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
    })),
    transition('hidden => visible', [
        animate('800ms {{delay}} cubic-bezier(0.4, 0, 0.2, 1)')
    ], { params: { delay: '0ms' } })
]);
