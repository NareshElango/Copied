using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One.Data.Migrations
{
    /// <inheritdoc />
    public partial class RBAC_Initial1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropIndex(
                name: "IX_TenantSubscriptions_SubscriptionPlanId1",
                table: "TenantSubscriptions");

            migrationBuilder.DropIndex(
                name: "IX_ChatLogs_UserId",
                table: "ChatLogs");

            migrationBuilder.DropColumn(
                name: "SubscriptionPlanId1",
                table: "TenantSubscriptions");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_Organizations_OrganizationId",
                table: "TenantSubscriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_TenantSubscriptions_SubscriptionPlans_SubscriptionPlanId",
                table: "TenantSubscriptions");

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionPlanId1",
                table: "TenantSubscriptions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TenantSubscriptions_SubscriptionPlanId1",
                table: "TenantSubscriptions",
                column: "SubscriptionPlanId1");

            migrationBuilder.CreateIndex(
                name: "IX_ChatLogs_UserId",
                table: "ChatLogs",
                column: "UserId");

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
    }
}
