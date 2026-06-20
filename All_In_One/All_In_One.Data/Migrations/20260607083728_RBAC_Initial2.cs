using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One.Data.Migrations
{
    /// <inheritdoc />
    public partial class RBAC_Initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_Organizations_OrganizationId",
                table: "TenantSubscriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId",
                table: "TenantSubscriptions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions");

            migrationBuilder.DropIndex(
                name: "IX_RolePermissions_RoleId",
                table: "RolePermissions");

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionPlanId1",
                table: "TenantSubscriptions",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions",
                columns: new[] { "RoleId", "PermissionId" });

            migrationBuilder.CreateTable(
                name: "UserPermissions",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPermissions", x => new { x.UserId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_UserPermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "PermissionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPermissions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TenantSubscriptions_SubscriptionPlanId1",
                table: "TenantSubscriptions",
                column: "SubscriptionPlanId1");

            migrationBuilder.CreateIndex(
                name: "IX_ChatLogs_UserId",
                table: "ChatLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissions_PermissionId",
                table: "UserPermissions",
                column: "PermissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatLogs_Users_UserId",
                table: "ChatLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantSubscriptions_Organizations_OrganizationId",
                table: "TenantSubscriptions",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "OrganizationId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId",
                table: "TenantSubscriptions",
                column: "SubscriptionPlanId",
                principalTable: "SubscriptionPlans",
                principalColumn: "SubscriptionPlanId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId1",
                table: "TenantSubscriptions",
                column: "SubscriptionPlanId1",
                principalTable: "SubscriptionPlans",
                principalColumn: "SubscriptionPlanId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatLogs_Users_UserId",
                table: "ChatLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_Organizations_OrganizationId",
                table: "TenantSubscriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId",
                table: "TenantSubscriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId1",
                table: "TenantSubscriptions");

            migrationBuilder.DropTable(
                name: "UserPermissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_TenantSubscriptions_SubscriptionPlanId1",
                table: "TenantSubscriptions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions");

            migrationBuilder.DropIndex(
                name: "IX_ChatLogs_UserId",
                table: "ChatLogs");

            migrationBuilder.DropColumn(
                name: "SubscriptionPlanId1",
                table: "TenantSubscriptions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                column: "UserRoleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RolePermissions",
                table: "RolePermissions",
                column: "RolePermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_RoleId",
                table: "RolePermissions",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_TenantSubscriptions_Organizations_OrganizationId",
                table: "TenantSubscriptions",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "OrganizationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId",
                table: "TenantSubscriptions",
                column: "SubscriptionPlanId",
                principalTable: "SubscriptionPlans",
                principalColumn: "SubscriptionPlanId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
