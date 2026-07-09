import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ViolenceReportsModule } from './modules/violence-reports/violence-reports.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { EventsModule } from './modules/events/events.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AIModule } from './modules/ai/ai.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';
import { DynamicFormsModule } from './modules/dynamic-forms/dynamic-forms.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    OrganizationsModule,
    ProfessionalsModule,
    ProjectsModule,
    CoursesModule,
    ClientsModule,
    ViolenceReportsModule,
    OpportunitiesModule,
    EventsModule,
    CertificatesModule,
    DashboardModule,
    NotificationsModule,
    AIModule,
    SettingsModule,
    AuditModule,
    DynamicFormsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
