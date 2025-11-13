import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MediaQueryService } from '@/app/shared/services/media-query.service';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly mediaQuery = inject(MediaQueryService);

  readonly isHandset = computed(
    () => this.mediaQuery.isXSmall() || this.mediaQuery.isSmall()
  );

  readonly menus = [
    {
      id: 'content',
      label: 'Content',
      description: 'Organize and manage creative assets.',
      icon: 'folder_open',
      items: [
        {
          label: 'Novels',
          description: 'Projects and metadata.',
          route: ['/dashboard', 'novels'],
        },
        {
          label: 'Tags',
          description: 'Taxonomy and organization.',
          route: ['/dashboard', 'content', 'tags'],
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Track performance and engagement metrics.',
      icon: 'bar_chart',
      items: [
        {
          label: 'Overview',
          description: 'High-level stats and summaries.',
          route: ['/dashboard', 'analytics', 'overview'],
        },
      ],
    },
    {
      id: 'inbox',
      label: 'Inbox',
      description: 'Coordinate conversations across channels.',
      icon: 'chat_bubble',
      items: [
        {
          label: 'All Conversations',
          description: 'Review every active thread.',
          route: ['/dashboard', 'inbox', 'conversations'],
        },
      ],
    },
    {
      id: 'automation',
      label: 'Automation',
      description: 'Automate repetitive customer workflows.',
      icon: 'auto_awesome',
      items: [
        {
          label: 'Rules',
          description: 'Configure automation triggers.',
          route: ['/dashboard', 'automation', 'rules'],
        },
      ],
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge Base',
      description: 'Maintain documentation and quick answers.',
      icon: 'library_books',
      items: [
        {
          label: 'Articles',
          description: 'Manage help center content.',
          route: ['/dashboard', 'knowledge-base', 'articles'],
        },
      ],
    },
    {
      id: 'contacts',
      label: 'Contacts',
      description: 'Maintain customer information and segmentation.',
      icon: 'people_alt',
      items: [
        {
          label: 'Directory',
          description: 'Search and categorize contacts.',
          route: ['/dashboard', 'contacts', 'directory'],
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Manage workspace preferences and communication settings.',
      icon: 'settings',
      items: [
        {
          label: 'Workspace',
          description: 'Workspace name, avatar, email, timezone, etc.',
          route: ['/dashboard', 'settings', 'workspace'],
        },
        {
          label: 'Profile',
          description: 'User information, email, profile photo.',
          route: ['/dashboard', 'settings', 'profile'],
        },
        {
          label: 'Security',
          description: 'User password, devices.',
          route: ['/dashboard', 'settings', 'security'],
        },
        {
          label: 'Roles & Permissions',
          description: "Company member's roles settings.",
          route: ['/dashboard', 'settings', 'roles'],
        },
        {
          label: 'Skills & Queues',
          description: 'Skill-based communication settings.',
          route: ['/dashboard', 'settings', 'skills'],
        },
        {
          label: 'Notifications',
          description: 'Email, mobile, desktop, SMS.',
          route: ['/dashboard', 'settings', 'notifications'],
        },
        {
          label: 'Canned Responses',
          description: 'Create, update, and delete canned responses.',
          route: ['/dashboard', 'settings', 'canned-responses'],
        },
        {
          label: 'Official Hour',
          description: 'Availability for visitor outreach.',
          route: ['/dashboard', 'settings', 'official-hour'],
        },
        {
          label: 'Billing',
          description: 'Payment methods, invoices, etc.',
          route: ['/dashboard', 'settings', 'billing'],
        },
        {
          label: 'Website Integrations',
          description: 'Website settings, iframe, embed, etc.',
          route: ['/dashboard', 'settings', 'integrations'],
        },
      ],
    },
  ];

  activeMenu = this.menus[0];

  selectMenu(menuId: string) {
    const next = this.menus.find((menu) => menu.id === menuId);
    if (next) {
      this.activeMenu = next;
    }
  }
}
