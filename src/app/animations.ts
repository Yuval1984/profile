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
        transform: 'translateY(30px)',
        visibility: 'hidden'
    })),
    state('visible', style({
        opacity: 1,
        transform: 'translateY(0)',
        visibility: 'visible'
    })),
    transition('hidden => visible', [
        style({ opacity: 0, transform: 'translateY(30px)', visibility: 'visible' }),
        animate('1200ms 800ms cubic-bezier(0.4, 0, 0.2, 1)',
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

export const slideInSineWave = trigger('slideInSineWave', [
  transition(':enter', [
    style({ transform: 'translateX(-150px)', opacity: 0 }),
    animate('1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', keyframes([
      style({ transform: 'translateX(-150px)', opacity: 0, offset: 0 }),
      style({ transform: 'translateX(25px)', opacity: 1, offset: 0.3 }),
      style({ transform: 'translateX(-12px)', offset: 0.5 }),
      style({ transform: 'translateX(8px)', offset: 0.65 }),
      style({ transform: 'translateX(-4px)', offset: 0.77 }),
      style({ transform: 'translateX(3px)', offset: 0.85 }),
      style({ transform: 'translateX(-1.5px)', offset: 0.91 }),
      style({ transform: 'translateX(1px)', offset: 0.96 }),
      style({ transform: 'translateX(-0.5px)', offset: 0.98 }),
      style({ transform: 'translateX(0)', opacity: 1, offset: 1 })
    ]))
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
