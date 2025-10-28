import { Component, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { slideInLeft, slideInRight, fadeInUp, typewriter, trainAnimation, experienceAnimation, longTypewriter, scaleInFade, portfolioAnimation } from './animations';
import { ProfileService } from './service/profile.service';
import { LocationService, GeoLocation } from './service/location.service';

interface TechStack {
  [key: string]: number;
}

interface Experience {
  company: string;
  role: string;
  years: string;
  isVisible: boolean;
  hasAnimated?: boolean;
  techStack: TechStack;
  details: string[];
  detailsVisible?: boolean[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  animations: [slideInLeft, slideInRight, fadeInUp, trainAnimation, experienceAnimation, typewriter, longTypewriter, scaleInFade, portfolioAnimation]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private experienceObserver: IntersectionObserver | null = null;
  private sectionIntersections: Map<string, number> = new Map();
  scrollProgress: number = 0;
  sectionState = {
    profile: { visible: false, hasAnimated: false, active: false },
    skills: { visible: false, hasAnimated: false, active: false },
    experience: { visible: false, hasAnimated: false, active: false },
    gallery: { visible: false, hasAnimated: false, active: false }
  };

  // Stats data
  stats: any = null;

  galleryItems = [
    {
      image: 'assets/preview projects/pharmecy/pharmecy.jpg',
      title: 'Pharmacy Dashboard',
      description: 'Comprehensive pharmacy management dashboard designed for pharmacists to monitor, approve, or reject patient medication requests. Features real-time patient medication tracking, prescription validation, drug interaction checking, and inventory management. Includes automated alerts for critical medications, dosage verification, and compliance monitoring. Enables pharmacists to efficiently manage patient care while ensuring medication safety and regulatory compliance.'
    },
    {
      image: 'assets/preview projects/dxc/1.png',
      title: 'Government Debt Cases Dashboard',
      description: 'Centralized dashboard for managing citizen debt cases in the government portal. Features comprehensive case overview, payment history, and debt status tracking. Enables officials to view all open cases per citizen, including detailed payment schedules, outstanding balances, and case-specific documentation. Includes smart filtering and sorting capabilities for efficient case management.'
    },
    {
      image: 'assets/preview projects/dxc/5.png',
      title: 'Inspector Activity Dashboard',
      description: 'Comprehensive overview of individual inspector workload and performance metrics. Displays all assigned and completed inspections per inspector, including scheduled visits, current status, and inspection outcomes. Features timeline view of daily activities, inspection completion rates, and upcoming assignments. Includes detailed statistics on inspection types, durations, and findings per inspector.'
    },
    {
      image: 'assets/preview projects/dxc/6.png',
      title: 'Agricultural Inspection Management System',
      description: 'Central administrative platform for managing all aspects of agricultural inspections. Features comprehensive demand tracking, back-office operations, and visit management. Includes inspection scheduling, resource allocation, violation tracking, and compliance monitoring. Provides tools for managing inspector assignments, generating reports, and coordinating follow-up actions. Enables administrators to oversee the entire inspection lifecycle from initial request to final resolution.'
    },
    {
      image: 'assets/preview projects/dxc/4.png',
      title: 'Agricultural Inspection Analytics',
      description: 'Advanced analytics dashboard providing insights into inspection patterns, compliance rates, and risk assessments. Features trend analysis of violations, seasonal inspection patterns, and predictive modeling for resource allocation. Includes customizable reporting for different stakeholder levels.'
    },
    {
      image: 'assets/preview projects/dxc/2.png',
      title: 'Inspection Task Management',
      description: 'Comprehensive task management system for agricultural inspections. Tracks inspection schedules, deadlines, and completion status. Features automated notification system for upcoming inspections, overdue tasks, and critical findings that require immediate attention.'
    },
    {
      image: 'assets/preview projects/dxc/3.png',
      title: 'Evidence Management System',
      description: 'Secure digital platform for managing inspection evidence and documentation. Features organized storage of photos, videos, and documents collected during field inspections. Includes advanced search capabilities, automated categorization, and secure sharing options for legal proceedings.'
    }
  ];

  profile = {
    name: 'Yuval Kogan',
    title: 'Senior Front-End Developer',
    education: 'B.Sc. in Computer Science',
    description:
      'Senior Front-End Developer with 8+ years of experience in Angular, delivering scalable applications and advanced data visualizations with yFiles for HTML. Expert in creating reusable components, optimizing performance, and building responsive design.',
    image: 'assets/Profile_Yuval.jpg'
  };

  skills = [
    {
      name: 'yFiles for HTML',
      icon: 'assets/yfiles.png',
      color: '#FF6B35',
      description: 'Expert in yFiles for HTML diagramming library, creating sophisticated data visualizations, interactive graphs, and complex network diagrams. Implementing custom layouts, node styling, edge routing, and advanced user interactions for enterprise applications.'
    },
    {
      name: 'Angular',
      icon: 'assets/angular.png',
      color: '#DD0031',
      description: 'Expert in Angular 18+, specializing in standalone components, dependency injection, signals, and change detection optimization. Implementing lazy loading, routing guards, and custom decorators for scalable enterprise applications.'
    },
    {
      name: 'TypeScript',
      icon: 'assets/ts.png',
      color: '#3178C6',
      description: 'Advanced TypeScript usage including generics, decorators, and strict type safety. Creating custom types, interfaces, and utility types for robust code. Implementing advanced patterns like type guards and mapped types.'
    },
    {
      name: 'RxJS',
      icon: 'assets/rxjs.png',
      color: '#B7178C',
      description: 'Proficient in reactive programming with RxJS, implementing complex data streams, custom operators, and subscription management. Using switchMap, mergeMap, combineLatest for efficient API calls and real-time updates.'
    },
    {
      name: 'NgRX',
      icon: 'assets/ngrx.png',
      color: '#BA2BD2',
      description: 'State management expert using NgRX store, effects, selectors, and actions. Implementing entity adapters, router store, and dev tools for debugging. Creating efficient state slices and handling side effects.'
    },
    {
      name: 'Angular Material',
      icon: 'assets/angular_material.png',
      color: '#3F51B5',
      description: 'Extensive experience with Angular Material components, theming, and accessibility. Creating custom material themes, extending components, and ensuring WCAG compliance. Building responsive layouts with Material Grid.'
    },
    {
      name: 'Angular CLI',
      icon: 'assets/cli.png',
      color: '#000000',
      description: 'Advanced usage of Angular CLI for project scaffolding, custom schematics, and build optimization. Creating custom builders, managing multiple projects, and implementing efficient development workflows.'
    },
    {
      name: 'CSS',
      icon: 'assets/css.png',
      color: '#CC6699',
      description: 'Expert in modern CSS3/SCSS with Flexbox, Grid, and custom properties. Implementing BEM methodology, creating maintainable stylesheets, and ensuring cross-browser compatibility. Building responsive designs with mobile-first approach.'
    },
    {
      name: 'Vite',
      icon: 'assets/vite.png',
      color: '#646CFF',
      description: 'Advanced experience with Vite build tool for fast development and optimized production builds. Leveraging native ES modules, hot module replacement, and plugin ecosystem for efficient Angular development workflows. Implementing custom Vite configurations and optimizing bundle sizes.'
    },
    {
      name: 'Playwright',
      icon: 'assets/playwright.png',
      color: '#2EAD33',
      description: 'Expert in Playwright for comprehensive end-to-end testing across multiple browsers and devices. Creating robust test suites, implementing page object models, and ensuring application reliability. Automating complex user workflows and cross-browser compatibility testing.'
    },
    {
      name: 'Ionic',
      icon: 'assets/ionic.png',
      color: '#3880FF',
      description: 'Advanced experience with Ionic framework for building cross-platform mobile applications using web technologies. Creating native-like mobile apps with Angular integration, implementing custom components, and leveraging Capacitor for native device functionality. Building responsive mobile interfaces with Ionic UI components.'
    },
    {
      name: 'Jasmine',
      icon: 'assets/jasmine.png',
      color: '#8A4182',
      description: 'Expert in Jasmine testing framework for comprehensive unit testing of Angular applications. Writing robust test suites with describe blocks, implementing spies and mocks, and ensuring code quality through behavior-driven development. Creating maintainable test cases with proper assertions and test isolation.'
    }
  ];

  skillDescriptions = [
    { description: this.skills[0].description, active: false },
    { description: this.skills[1].description, active: false },
    { description: this.skills[2].description, active: false },
    { description: this.skills[3].description, active: false },
    { description: this.skills[4].description, active: false },
    { description: this.skills[5].description, active: false },
    { description: this.skills[6].description, active: false },
    { description: this.skills[7].description, active: false },
    { description: this.skills[8].description, active: false },
    { description: this.skills[9].description, active: false },
    { description: this.skills[10].description, active: false },
    { description: this.skills[11].description, active: false }
  ];

  @ViewChildren('techChart') chartCanvases!: QueryList<ElementRef>;
  private charts: Chart[] = [];

  getDetailVisibility(expIndex: number, detailIndex: number): boolean {
    return this.experiences[expIndex]?.detailsVisible?.[detailIndex] || false;
  }

  showSkillDescription(index: number) {
    this.hideSkillDescription();
    this.skillDescriptions[index].active = true;
  }

  hideSkillDescription() {
    for (let skillDescription of this.skillDescriptions) {
      skillDescription.active = false;
    }
  }

  experiences: Experience[] = [
    {
      company: 'CodiQ',
      role: 'Front-End Lead',
      years: '2022–Present',
      isVisible: false,
      techStack: {
        'Angular': 30,
        'TypeScript': 20,
        'NgRX': 15,
        'RxJS': 15,
        'yFiles': 20
      },
      details: [
        'Lead Developer in a team of 4 engineers, delivering Angular 18 and TypeScript applications for the industrial automation sector.',
        'Built a reusable Angular component library using standalone components, directives, pipes, signals, RxJS, Angular Material, Angular CLI, dependency injection, change detection, and NgRX for state management, cutting delivery time by 40% and reducing duplicate code.',
        'Developed high-performance yFiles for HTML visualizations handling 10k+ nodes and edges.',
        'Designed responsive UIs with HTML5, CSS3/SCSS, Flexbox, and CSS Grid, integrated with REST APIs.',
        'Leveraged AI-assisted coding tools (Cursor IDE, GitHub Copilot, ChatGPT) to accelerate development and improve code quality.'
      ]
    },
    {
      company: 'NICE',
      role: 'Senior Front-End Engineer',
      years: '2021–2022',
      isVisible: false,
      techStack: {
        'Angular': 30,
        'TypeScript': 20,
        'RxJS': 20,
        'Bootstrap': 15,
        'Playwright': 15
      },
      details: [
        'Built enterprise Angular (TypeScript, RxJS, SCSS) applications for customer service platforms.',
        'Optimized page load performance, improving response times in live dashboards.',
        'Implemented responsive layouts with CSS Grid, Flexbox, Bootstrap 5, and SCSS, improving accessibility and UI consistency.',
        'Automated testing with Playwright and Karma-Jasmine, reducing manual QA time by 40%.'
      ]
    },
    {
      company: 'DXC',
      role: 'Front-End Engineer',
      years: '2019–2021',
      isVisible: false,
      techStack: {
        'Angular': 30,
        'TypeScript': 20,
        'RxJS': 20,
        'Ionic': 15,
        'SCSS': 15
      },
      details: [
        'Built and maintained Angular (TypeScript, RxJS, SCSS) applications for four government portals, improving performance with trackBy, lazy-loading, and async pipes, while ensuring accessibility with ARIA labels.',
        'Integrated REST APIs with Swagger/Postman, reducing request failure rates.',
        'Published hybrid mobile apps using Ionic and Cordova, deployed to Google Play.',
        'Collaborated with UI/UX designers to ensure consistent standards across projects.'
      ]
    },
    {
      company: 'Hermon Labs TI',
      role: 'Full-Stack Developer',
      years: '2018–2019',
      isVisible: false,
      techStack: {
        'Angular': 25,
        'C#/.NET': 25,
        'SQL': 20,
        'RxJS': 15,
        'SCSS': 15
      },
      details: [
        'Delivered three production applications for engineers in a lab environment, focusing mainly on the front end with Angular (TypeScript, RxJS, SCSS) and contributing to the back end with .NET Core, C#, and SQL Server.',
        'Assisted in developing APIs and implementing new features in collaboration with senior engineers.',
        'Helped establish structured Git/TFS workflows, improving version control and team collaboration.'
      ]
    }
  ];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private locationService: LocationService
  ) {
    window.addEventListener('scroll', this.updateScrollProgress.bind(this));
  }

  private updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    this.scrollProgress = (scrolled / documentHeight) * 100;
    this.cdr.detectChanges();
  }

  openContactDialog() {
    import('./contact-dialog.component').then(({ ContactDialogComponent }) => {
      this.dialog.open(ContactDialogComponent, {
        panelClass: 'contact-dialog-panel',
        autoFocus: false
      });
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async ngOnInit() {
    // Start the profile tracking session (non-blocking). Fetch location in background
    this.locationService
      .getLocation()
      .then(loc => this.profileService.start(loc ?? undefined))
      .catch(() => this.profileService.start())
      .catch(err => {
        console.warn('[profile] Start session failed (backend may be unavailable)', err);
      });

    // Fetch stats (non-blocking)
    this.profileService.statsToday().then(stats => {
      this.stats = stats;
      this.cdr.detectChanges();
    }).catch(err => {
      console.warn('[profile] Failed to fetch stats (using mock data for development)', err);
      // Mock data for development when backend is unavailable
      this.stats = {
        tz: 'UTC',
        days: [
          {
            day: new Date().toISOString().split('T')[0],
            hourBuckets: { '18': 2 },
            totalVisits: 42,
            totalDurationMs: 26774,
            avgDurationMs: 13387
          }
        ]
      };
      this.cdr.detectChanges();
    });

    // Initialize Intersection Observer for sections
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const sectionId = entry.target.getAttribute('id');
          if (!sectionId) return;

          const section = this.sectionState[sectionId as keyof typeof this.sectionState];

          // Handle visibility for animations
          if (entry.isIntersecting) {
            section.visible = true;
          } else {
            section.visible = false;
            section.hasAnimated = false;
          }

          // Store the intersection ratio for each section
          this.sectionIntersections.set(sectionId, entry.intersectionRatio);
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeSection = '';

        this.sectionIntersections.forEach((ratio, sectionId) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeSection = sectionId;
          }
        });

        // Only update active state if there's a clear winner (ratio > 0.1)
        if (maxRatio > 0.1) {
          Object.keys(this.sectionState).forEach(key => {
            const section = this.sectionState[key as keyof typeof this.sectionState];
            section.active = (key === activeSection);
          });
          this.cdr.detectChanges();
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-80px 0px -80px 0px'
      }
    );

    // Initialize Intersection Observer for experience cards
    const experienceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            if (index !== null) {
              const expIndex = parseInt(index);
              const exp = this.experiences[expIndex];
              exp.isVisible = true;

              // Only animate if it hasn't been animated before
              if (!exp.hasAnimated) {
                exp.hasAnimated = true;
                exp.detailsVisible = new Array(exp.details.length).fill(false);

                // Show details one by one with delays
                exp.details.forEach((_, i) => {
                  setTimeout(() => {
                    if (exp.detailsVisible) {
                      exp.detailsVisible![i] = true;
                      this.cdr.detectChanges();
                    }
                  }, i * 800);
                });

                // Animate chart
                if (this.charts[expIndex]) {
                  this.charts[expIndex].destroy();
                  const canvas = this.chartCanvases.toArray()[expIndex];
                  if (canvas) {
                    this.initializeChart(
                      canvas.nativeElement,
                      exp.techStack,
                      expIndex
                    );
                  }
                }
              } else {
                // If already animated, just show all details
                exp.detailsVisible = new Array(exp.details.length).fill(true);
              }
              this.cdr.detectChanges();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-100px'
      }
    );

    // Store the experience observer for cleanup
    this.experienceObserver = experienceObserver;
  }

  private initializeChart(canvas: HTMLCanvasElement, techStack: TechStack, index: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      '#FF6384', // Pink
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40'  // Orange
    ];

    const data: ChartData = {
      labels: Object.keys(techStack),
      datasets: [{
        data: Object.values(techStack) as number[],
        backgroundColor: colors,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2
      }]
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#ffffff',
              font: {
                size: 12
              },
              padding: 20
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        },
        transitions: {
          active: {
            animation: {
              duration: 2000
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts[index] = chart;
  }

  ngAfterViewInit() {
    // Observe sections
    const sections = this.el.nativeElement.querySelectorAll('.section');
    sections.forEach((section: Element) => {
      if (this.observer) {
        this.observer.observe(section);
      }
    });

    // Observe experience cards
    const experienceCards = this.el.nativeElement.querySelectorAll('.experience-card');
    experienceCards.forEach((card: Element) => {
      if (this.experienceObserver) {
        this.experienceObserver.observe(card);
      }
    });

    // Trigger initial animation for profile and skills
    setTimeout(() => {
      Object.keys(this.sectionState).forEach(key => {
        this.sectionState[key as keyof typeof this.sectionState].visible = true;
      });
      this.cdr.detectChanges();
    }, 100);

    // Initialize charts after view is ready
    this.chartCanvases.forEach((canvasRef, index) => {
      this.initializeChart(
        canvasRef.nativeElement,
        this.experiences[index].techStack,
        index
      );
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.experienceObserver) {
      this.experienceObserver.disconnect();
    }
    // Cleanup charts
    this.charts.forEach(chart => chart?.destroy());
    // Remove scroll listener
    window.removeEventListener('scroll', this.updateScrollProgress.bind(this));

    // End the metrics session
    this.profileService
      ?.end()
      .catch(err => console.warn('[metrics] end() failed', err));
  }
}