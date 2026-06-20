using All_In_One.Domain.Entities.Chatbot;
using All_In_One.Domain.Entities.Geography;
using All_In_One.Domain.Entities.Security;
using All_In_One.Domain.Entities.Subscription;
using All_In_One.Domain.Entities.Tenant;
using Microsoft.EntityFrameworkCore;

namespace All_In_One.Data.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Geography
        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Division> Divisions { get; set; }

        // Tenant
        public DbSet<TenantType> TenantTypes { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<OrganizationBranch> OrganizationBranches { get; set; }

        // Security
        public DbSet<UserType> UserTypes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        // Chatbot
        public DbSet<ChatCommand> ChatCommands { get; set; }
        public DbSet<ChatLog> ChatLogs { get; set; }

        // Subscription
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public DbSet<TenantSubscription> TenantSubscriptions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }

        public DbSet<ActionRole> ActionRoles { get; set; }
        public DbSet<Actions> Actions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // PRIMARY KEYS + AUTO INCREMENT
            // =========================

            modelBuilder.Entity<Country>()
                .HasKey(x => x.CountryId);
            modelBuilder.Entity<Country>()
                .Property(x => x.CountryId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<State>()
                .HasKey(x => x.StateId);
            modelBuilder.Entity<State>()
                .Property(x => x.StateId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<District>()
                .HasKey(x => x.DistrictId);
            modelBuilder.Entity<District>()
                .Property(x => x.DistrictId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Division>()
                .HasKey(x => x.DivisionId);
            modelBuilder.Entity<Division>()
                .Property(x => x.DivisionId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<TenantType>()
                .HasKey(x => x.TenantTypeId);
            modelBuilder.Entity<TenantType>()
                .Property(x => x.TenantTypeId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Organization>()
                .HasKey(x => x.OrganizationId);
            modelBuilder.Entity<Organization>()
                .Property(x => x.OrganizationId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<OrganizationBranch>()
                .HasKey(x => x.BranchId);
            modelBuilder.Entity<OrganizationBranch>()
                .Property(x => x.BranchId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<UserType>()
                .HasKey(x => x.UserTypeId);
            modelBuilder.Entity<UserType>()
                .Property(x => x.UserTypeId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<User>()
                .HasKey(x => x.UserId);
            modelBuilder.Entity<User>()
                .Property(x => x.UserId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Role>()
                .HasKey(x => x.RoleId);
            modelBuilder.Entity<Role>()
                .Property(x => x.RoleId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Permission>()
                .HasKey(x => x.PermissionId);
            modelBuilder.Entity<Permission>()
                .Property(x => x.PermissionId)
                .ValueGeneratedOnAdd();

            //modelBuilder.Entity<UserRole>()
            //    .HasKey(x => x.UserRoleId);
            //modelBuilder.Entity<UserRole>()
            //    .Property(x => x.UserRoleId)
            //    .ValueGeneratedOnAdd();

            modelBuilder.Entity<RolePermission>()
                .HasKey(x => x.RolePermissionId);
            modelBuilder.Entity<RolePermission>()
                .Property(x => x.RolePermissionId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<ChatCommand>()
                .HasKey(x => x.ChatCommandId);
            modelBuilder.Entity<ChatCommand>()
                .Property(x => x.ChatCommandId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<ChatLog>()
                .HasKey(x => x.ChatLogId);
            modelBuilder.Entity<ChatLog>()
                .Property(x => x.ChatLogId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<SubscriptionPlan>()
                .HasKey(x => x.SubscriptionPlanId);
            modelBuilder.Entity<SubscriptionPlan>()
                .Property(x => x.SubscriptionPlanId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<TenantSubscription>()
                .HasKey(x => x.TenantSubscriptionId);
            modelBuilder.Entity<TenantSubscription>()
                .Property(x => x.TenantSubscriptionId)
                .ValueGeneratedOnAdd();

            // Primary Keys
            modelBuilder.Entity<Country>().HasKey(x => x.CountryId);
            modelBuilder.Entity<State>().HasKey(x => x.StateId);
            modelBuilder.Entity<District>().HasKey(x => x.DistrictId);
            modelBuilder.Entity<Division>().HasKey(x => x.DivisionId);

            modelBuilder.Entity<TenantType>().HasKey(x => x.TenantTypeId);
            modelBuilder.Entity<Organization>().HasKey(x => x.OrganizationId);
            modelBuilder.Entity<OrganizationBranch>().HasKey(x => x.BranchId);

            modelBuilder.Entity<UserType>().HasKey(x => x.UserTypeId);
            modelBuilder.Entity<User>().HasKey(x => x.UserId);
            modelBuilder.Entity<Role>().HasKey(x => x.RoleId);
            modelBuilder.Entity<Permission>().HasKey(x => x.PermissionId);
            //modelBuilder.Entity<UserRole>().HasKey(x => x.UserRoleId);
            modelBuilder.Entity<RolePermission>().HasKey(x => x.RolePermissionId);

            modelBuilder.Entity<ChatCommand>().HasKey(x => x.ChatCommandId);
            modelBuilder.Entity<ChatLog>().HasKey(x => x.ChatLogId);

            modelBuilder.Entity<SubscriptionPlan>().HasKey(x => x.SubscriptionPlanId);
            modelBuilder.Entity<TenantSubscription>().HasKey(x => x.TenantSubscriptionId);

            // =========================
            // RELATIONSHIPS (NO CASCADE)
            // =========================

            // Geography
            modelBuilder.Entity<State>()
                .HasOne(x => x.Country)
                .WithMany(x => x.States)
                .HasForeignKey(x => x.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<District>()
                .HasOne(x => x.State)
                .WithMany(x => x.Districts)
                .HasForeignKey(x => x.StateId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Division>()
                .HasOne(x => x.District)
                .WithMany(x => x.Divisions)
                .HasForeignKey(x => x.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);

            // Organization
            modelBuilder.Entity<Organization>()
                .HasOne(x => x.TenantType)
                .WithMany(x => x.Organizations)
                .HasForeignKey(x => x.TenantTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Organization>()
                .HasOne(x => x.District)
                .WithMany(x => x.Organizations)
                .HasForeignKey(x => x.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);

            // Organization Branch
            modelBuilder.Entity<OrganizationBranch>()
                .HasOne(x => x.Organization)
                .WithMany(x => x.Branches) // matches Organization.Branches
                .HasForeignKey(x => x.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrganizationBranch>()
                .HasOne(x => x.Division)
                .WithMany() // Division currently has no OrganizationBranches collection
                .HasForeignKey(x => x.DivisionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Users
            modelBuilder.Entity<User>()
                .HasOne(x => x.Organization)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(x => x.Branch)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.BranchId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(x => x.UserType)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.UserTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // User Role
            modelBuilder.Entity<User>()
                .HasOne(x => x.Role)
                .WithMany()
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserRole
            //modelBuilder.Entity<UserRole>()
            //    .HasOne(x => x.User)
            //    //.WithMany(x => x.UserRoles)
            //    .HasForeignKey(x => x.UserId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<UserRole>()
            //    .HasOne(x => x.Role)
            //    .WithMany(x => x.UserRoles)
            //    .HasForeignKey(x => x.RoleId)
            //    .OnDelete(DeleteBehavior.Restrict);

            // RolePermission
            modelBuilder.Entity<RolePermission>()
                .HasOne(x => x.Role)
                .WithMany(x => x.RolePermissions)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RolePermission>()
                .HasOne(x => x.Permission)
                .WithMany(x => x.RolePermissions)
                .HasForeignKey(x => x.PermissionId)
                .OnDelete(DeleteBehavior.Restrict);

            // ChatLog
            modelBuilder.Entity<ChatLog>()
                .HasOne<User>() // ChatLog has UserId but no navigation property
                .WithMany()     // User has no ChatLogs collection
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // TenantSubscription
            modelBuilder.Entity<TenantSubscription>()
                .HasOne(x => x.Organization)
                .WithMany()
                .HasForeignKey(x => x.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TenantSubscription>()
                .HasOne(x => x.SubscriptionPlan)
                .WithMany()
                .HasForeignKey(x => x.SubscriptionPlanId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<UserPermission>()
    .HasKey(x => new { x.UserId, x.PermissionId });

            //modelBuilder.Entity<UserRole>()
            //    .HasKey(x => new { x.UserId, x.RoleId });

            modelBuilder.Entity<RolePermission>()
                .HasKey(x => new { x.RoleId, x.PermissionId });

    //        modelBuilder.Entity<UserPermission>()
    //.HasOne(x => x.User)
    //.WithMany(u => u.UserPermissions)
    //.HasForeignKey(x => x.UserId);

            modelBuilder.Entity<UserPermission>()
                .HasOne(x => x.Permission)
                .WithMany()
                .HasForeignKey(x => x.PermissionId);

            modelBuilder.Entity<Actions>()
    .HasKey(x => x.ActionId);

            modelBuilder.Entity<Actions>()
                .Property(x => x.ActionId)
                .ValueGeneratedOnAdd();


            modelBuilder.Entity<ActionRole>()
    .HasKey(x => new { x.ActionId, x.RoleId });

            modelBuilder.Entity<ActionRole>()
                .HasOne(x => x.Action)
                .WithMany(x => x.ActionRoles)
                .HasForeignKey(x => x.ActionId);

            modelBuilder.Entity<ActionRole>()
                .HasOne(x => x.Role)
                .WithMany(x => x.ActionRoles)
                .HasForeignKey(x => x.RoleId);
        }
    }
}