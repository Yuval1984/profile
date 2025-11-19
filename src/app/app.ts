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
import { slideInLeft, slideInRight, fadeInUp, typewriter, trainAnimation, experienceAnimation, longTypewriter, scaleInFade, portfolioAnimation, slideInSineWave } from './animations';
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
  animations: [slideInLeft, slideInRight, fadeInUp, trainAnimation, experienceAnimation, typewriter, longTypewriter, scaleInFade, portfolioAnimation, slideInSineWave]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private experienceObserver: IntersectionObserver | null = null;
  private sectionIntersections: Map<string, number> = new Map();
  scrollProgress: number = 0;
  sectionState = {
    profile: { visible: false, hasAnimated: false, active: false, imageAnimated: false },
    skills: { visible: false, hasAnimated: false, active: false },
    experience: { visible: false, hasAnimated: false, active: false },
    gallery: { visible: false, hasAnimated: false, active: false }
  };

  // Stats data
  stats: any = null;
  showDeviceTypes: boolean = false;
  isFoldingOut: boolean = false;
  private deviceTypesTimer: any = null;

  galleryItems = [
    {
      image: 'assets/preview projects/private/cinema1.png',
      title: 'Cinema App - Latest Movies',
      description: 'A polished, responsive Cinema Dashboard built in React, showcasing smooth UI interactions and optimized rendering. The app lets users browse a large grid of movies and TV shows, filter by title type, perform instant search, switch between Cinema/Favourites views, and toggle dark mode. The interface uses useMemo, useCallback, React.memo, and MobX for state management to keep the UI fast, even with many posters on screen. HTTP requests are handled with Axios for efficient API communication. Each title card displays a poster, hover effects, and a favourite toggle, with real-time counters showing total titles and saved favourites. The layout is clean, modern, and fully responsive, designed to deliver a cinematic browsing experience.'
    },
    {
      image: 'assets/preview projects/private/cinema2.png',
      title: 'Cinema App - Movie Details',
      description: 'A structured, high-fidelity movie detail page that displays full metadata for a selected title: large poster, release year, runtime, content type, rating, vote count, and genre tags. The view also includes a clean plot summary and a breakdown of technical details in well-organized cards. The page is fully state-driven and optimized with useMemo, useCallback, React.memo, and a global useContext store, ensuring smooth rendering and instant navigation across titles. A persistent top navigation bar provides quick access to Cinema, Favourites, Expand mode, counters, and Dark Mode. Features fully responsive design using Flexbox for seamless adaptation across all device sizes.'
    },
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
      image: 'assets/preview projects/private/wheater1.png',
      title: 'Weather App - Orlando Forecast',
      description: 'A clean, responsive global weather app built with Angular 20, using Signals, control-flow blocks (@for / @if with track), OnPush, and standalone components for fast, reactive rendering. It lets users search any city via Geoapify, shows it on a Leaflet map, and fetches 1–5 day forecasts from OpenWeatherMap. Each card displays temperature, weather description, wind speed & direction, visibility, plus country, population, timezone, sunrise, and sunset — giving a rich, compact snapshot of the city\'s weather.'
    },
    {
      image: 'assets/preview projects/private/wheater2.png',
      title: 'Weather App - Los Angeles Forecast',
      description: 'A clean, detailed weather view built with Angular 20, using Signals, control-flow blocks, OnPush, and standalone components for efficient, reactive UI updates. Each forecast card presents temperature, weather description, wind speed, wind direction, and visibility, using clear icons and structured sections. The header shows the city\'s country, population, timezone, sunrise, and sunset, giving a full snapshot of local conditions. The layout is fully responsive, built with Flexbox and CSS media queries, ensuring an adaptive design that scales smoothly across mobile, tablet, and desktop. Data is powered by Geoapify (city search + map) and OpenWeatherMap (1–5 day forecast), combined with interactive mapping via Leaflet.'
    },
    {
      image: 'assets/preview projects/private/repairman.png',
      title: 'Repairman Professional App',
      description: 'A modern, responsive home-appliance repair website built with Angular 20, using control-flow blocks, FormControls, custom pipes, custom directives, Angular animations, and a standalone components architecture for a fast, polished UI. It\'s tailored for a professional technician servicing refrigerators, microwaves, ovens, washers, dryers, and more. The layout uses Flexbox and media queries for full responsiveness, integrates Resend for automatic service-request emails, and uses a Node.js tracking service on Render to monitor visitor activity and sessions.'
    },
    {
      image: 'assets/preview projects/private/metrics.png',
      title: 'Metrics Analytics Dashboard',
      description: 'A self-hosted analytics dashboard built in React with Chart.js and WebSockets for real-time updates. It tracks my own apps and gives clear visibility into user behavior: how many users visited, when they visited, how long they stayed, and from which device and location they entered. All data is visualized in live charts and KPI cards, making it easy to monitor usage patterns across my applications in real time.'
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
    description: [
      '• Nice to meet you - I\'m Yuval, a Senior Front-End Developer with 8+ years of experience building scalable Angular and React applications.',
      '• I specialize in Angular 20, TypeScript, RxJS, Signals, NgRx, Angular Material, and CLI, as well as React with Hooks, Zustand, and MUI. I\'ve built complex UI architectures and high-performance data visualizations, including yFiles graphs with 10k+ nodes.',
      '• One of my key achievements is creating a reusable Angular component library that cut feature delivery time by 40%. I focus on clean, maintainable code, performance, and usability — crafting responsive UIs with HTML5, SCSS, Flexbox, and Grid.',
      '• I\'ve also mentored front-end teams, driven best practices, and helped align development with business goals. I\'m passionate about building front-end solutions that are powerful, fast, and a joy to use.'
    ],
    image: 'assets/Profile_Yuval.jpg'
  };
  
  profileDescriptionVisible: boolean[] = [];

  animateProfileDescription() {
    // Initialize all paragraphs as hidden
    this.profileDescriptionVisible = new Array(this.profile.description.length).fill(false);
    
    // Show each paragraph sequentially with delay
    this.profile.description.forEach((_, index) => {
      setTimeout(() => {
        this.profileDescriptionVisible[index] = true;
        this.cdr.detectChanges();
      }, index * 1500); // 1500ms delay between each paragraph
    });
  }

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

  isSkillsTapePaused: boolean = false;
  private skillDescriptionTimer: any = null;
  private isHoveringSkillsTape: boolean = false;

  showSkillDescription(index: number) {
    // Clear any existing timer
    if (this.skillDescriptionTimer) {
      clearTimeout(this.skillDescriptionTimer);
    }

    // Pause the tape
    this.isSkillsTapePaused = true;
    
    // Hide all descriptions first
    for (let skillDescription of this.skillDescriptions) {
      skillDescription.active = false;
    }
    // Show selected description
    this.skillDescriptions[index].active = true;
    this.cdr.detectChanges();

    // Auto-hide and resume movement after 5 seconds
    this.skillDescriptionTimer = setTimeout(() => {
      // Hide all descriptions
      for (let skillDescription of this.skillDescriptions) {
        skillDescription.active = false;
      }
      // Always resume movement after timer expires
      this.isSkillsTapePaused = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  onSkillsTapeMouseEnter() {
    this.isHoveringSkillsTape = true;
    this.isSkillsTapePaused = true;
  }

  onSkillsTapeMouseLeave() {
    this.isHoveringSkillsTape = false;
    // Only resume if no description is active
    const hasActiveDescription = this.skillDescriptions.some(desc => desc.active);
    if (!hasActiveDescription) {
      this.isSkillsTapePaused = false;
    }
  }

  onSkillItemHover(index: number) {
    // Clear any existing timer
    if (this.skillDescriptionTimer) {
      clearTimeout(this.skillDescriptionTimer);
      this.skillDescriptionTimer = null;
    }

    // Pause the tape
    this.isSkillsTapePaused = true;
    
    // Hide all descriptions first
    for (let skillDescription of this.skillDescriptions) {
      skillDescription.active = false;
    }
    // Show selected description
    this.skillDescriptions[index].active = true;
    this.cdr.detectChanges();
  }

  onSkillItemLeave() {
    // Hide all descriptions when mouse leaves
    for (let skillDescription of this.skillDescriptions) {
      skillDescription.active = false;
    }
    // Resume movement if not hovering over the tape
    if (!this.isHoveringSkillsTape) {
      this.isSkillsTapePaused = false;
    }
    this.cdr.detectChanges();
  }

  hideSkillDescription() {
    if (this.skillDescriptionTimer) {
      clearTimeout(this.skillDescriptionTimer);
    }
    for (let skillDescription of this.skillDescriptions) {
      skillDescription.active = false;
    }
    // Only resume movement if not hovering over the tape
    if (!this.isHoveringSkillsTape) {
      this.isSkillsTapePaused = false;
    }
    this.cdr.detectChanges();
  }

  getSkillsForTape() {
    // Return skills duplicated 4 times for seamless infinite scroll
    // This ensures items are always entering from the right as they exit left
    // With 4 copies, we can move by 25% (one set) and have seamless looping
    return [...this.skills, ...this.skills, ...this.skills, ...this.skills];
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
        'Lead Developer in a team of 4 engineers, delivering Angular 20 and TypeScript applications for the industrial automation sector.',
        'Built a reusable Angular component library using standalone components, directives, pipes, signals, deferrable views, RxJS, Angular Material, dependency injection, change detection, and NgRX - cutting delivery time by 40% and reducing duplicate code.',
        'Built secure, high-performance data-visualization canvas (10k+ nodes) using yFiles for HTML.',
        'Applied responsive and accessible design with HTML5, SCSS, FlexBox, and Angular Material.',
        'Integrated AI-assisted tools (Cursor IDE, Claude, ChatGPT) into the development workflow, improving delivery speed and code consistency.'
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
        'Built enterprise Angular applications (TypeScript, RxJS, SCSS) for customer service platforms.',
        'Optimized performance in live dashboards using trackBy, async pipes, lazy-loading, and the OnPush change detection strategy, significantly improving load times and performance.',
        'Delivered responsive and accessible UIs with CSS Grid, Flexbox, Bootstrap 5, and SCSS, ensuring design consistency across devices.',
        'Automated testing with Playwright and Karma-Jasmine, reducing manual QA effort by 32%.'
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
        'Built and maintained Angular applications (TypeScript, RxJS, SCSS) for four government portals, improving performance with trackBy, lazy-loading, and async pipes, while ensuring accessibility with ARIA labels.',
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

  private isContactDialogOpen: boolean = false;

  openContactDialog(event?: Event) {
    // Prevent opening multiple dialogs
    if (this.isContactDialogOpen) {
      return;
    }
    
    // Remove focus from button to prevent ripple color changes
    if (event && event.target) {
      (event.target as HTMLElement).blur();
    }
    
    import('./contact-dialog.component').then(({ ContactDialogComponent }) => {
      this.isContactDialogOpen = true;
      
      const dialogRef = this.dialog.open(ContactDialogComponent, {
        panelClass: 'contact-dialog-panel',
        autoFocus: false
      });
      
      dialogRef.afterClosed().subscribe(() => {
        this.isContactDialogOpen = false;
        
        // Remove focus from any focused elements after dialog closes
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleDeviceTypes() {
    // Clear any existing timer
    if (this.deviceTypesTimer) {
      clearTimeout(this.deviceTypesTimer);
    }

    // If already showing, fold it out
    if (this.showDeviceTypes) {
      this.isFoldingOut = true;
      this.cdr.detectChanges();
      
      // Hide after animation completes
      setTimeout(() => {
        this.showDeviceTypes = false;
        this.isFoldingOut = false;
        this.cdr.detectChanges();
      }, 600); // Match the foldUp animation duration
      return;
    }

    // Show device types with fold down animation
    this.isFoldingOut = false;
    this.showDeviceTypes = true;
    this.cdr.detectChanges();

    // Hide after 10 seconds with fold up animation
    this.deviceTypesTimer = setTimeout(() => {
      this.isFoldingOut = true;
      this.cdr.detectChanges();
      
      // Hide after animation completes
      setTimeout(() => {
        this.showDeviceTypes = false;
        this.isFoldingOut = false;
        this.cdr.detectChanges();
      }, 600); // Match the foldUp animation duration
    }, 10000);
  }

  getDeviceTypes() {
    if (this.stats && this.stats.days && this.stats.days.length > 0 && this.stats.days[0].deviceTypes) {
      return this.stats.days[0].deviceTypes;
    }
    return null;
  }

  async ngOnInit() {
    // Initialize API calls in background (non-blocking)
    this.initializeProfileTracking();

    // Initialize Intersection Observer for sections (always runs, independent of API)
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const sectionId = entry.target.getAttribute('id');
          if (!sectionId) return;

          const section = this.sectionState[sectionId as keyof typeof this.sectionState];

          // Handle visibility for animations
          if (entry.isIntersecting) {
            section.visible = true;
            
            // Animate profile description paragraphs sequentially
            if (sectionId === 'profile') {
              const profileSection = section as typeof this.sectionState.profile;
              // Mark image as animated after a delay to allow animation to complete
              if (!profileSection.imageAnimated) {
                setTimeout(() => {
                  profileSection.imageAnimated = true;
                  this.cdr.detectChanges();
                }, 1500);
              }
              if (!profileSection.hasAnimated) {
                // Delay description animation to allow image animation first
                setTimeout(() => {
                  profileSection.hasAnimated = true;
                  this.animateProfileDescription();
                }, 1000);
              }
            }
          } else {
            section.visible = false;
            section.hasAnimated = false;
            // Reset profile description visibility
            if (sectionId === 'profile') {
              const profileSection = section as typeof this.sectionState.profile;
              profileSection.imageAnimated = false;
              this.profileDescriptionVisible = [];
            }
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

  private async initializeProfileTracking() {
    // Step 1: Start the profile tracking session first and wait for it to complete
    try {
      const location = await this.locationService.getLocation().catch(() => null);
      const sessionId = await this.profileService.start(location ?? undefined);
      
      if (sessionId) {
        // Step 2: Only after session is created, fetch stats
        try {
          const stats = await this.profileService.statsToday();
          this.stats = stats;
          this.cdr.detectChanges();

          // Step 3: Only after stats are received, start heartbeat every 30 seconds
          this.profileService.startHeartbeat(30000);
        } catch (err) {
          console.warn('[profile] Failed to fetch stats (backend may be unavailable)', err);
          // Don't set mock data - button will remain hidden
        }
      } else {
        console.warn('[profile] Start session failed (backend may be unavailable)');
      }
    } catch (err) {
      console.warn('[profile] Start session failed (backend may be unavailable)', err);
    }
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
        onClick: () => {
          // Disable click interactions to prevent removing skills
        },
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#ffffff',
              font: {
                size: 12
              },
              padding: 20
            },
            onClick: () => {
              // Disable legend click to prevent removing skills
            }
          },
          tooltip: {
            enabled: true
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

    // Clear device types timer
    if (this.deviceTypesTimer) {
      clearTimeout(this.deviceTypesTimer);
    }

    // Clear skill description timer
    if (this.skillDescriptionTimer) {
      clearTimeout(this.skillDescriptionTimer);
    }

    // End the metrics session
    this.profileService
      ?.end()
      .catch(err => console.warn('[metrics] end() failed', err));
  }
}