import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalProjects,
      totalCourses,
      totalReports,
      totalOpportunities,
      totalEvents,
      totalCertificates,
      totalOrganizations,
      reportsByLevel,
      projectsByStatus,
      recentUsers,
      recentReports,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.course.count({ where: { deletedAt: null } }),
      this.prisma.violenceReport.count({ where: { deletedAt: null } }),
      this.prisma.opportunity.count({ where: { deletedAt: null } }),
      this.prisma.event.count({ where: { deletedAt: null } }),
      this.prisma.certificate.count(),
      this.prisma.organization.count({ where: { deletedAt: null } }),
      this.prisma.violenceReport.groupBy({
        by: ['level'],
        where: { deletedAt: null },
        _count: { level: true },
      }),
      this.prisma.project.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: { status: true },
      }),
      this.prisma.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.violenceReport.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          reportCode: true,
          level: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      counts: {
        users: totalUsers,
        projects: totalProjects,
        courses: totalCourses,
        reports: totalReports,
        opportunities: totalOpportunities,
        events: totalEvents,
        certificates: totalCertificates,
        organizations: totalOrganizations,
      },
      reportsByLevel: reportsByLevel.map((item) => ({
        level: item.level,
        count: item._count.level,
      })),
      projectsByStatus: projectsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      recentUsers,
      recentReports,
    };
  }
}
