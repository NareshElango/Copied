using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixSubscriptionRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Organizations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "Organizations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_CountryId",
                table: "Organizations",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_StateId",
                table: "Organizations",
                column: "StateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Organizations_Countries_CountryId",
                table: "Organizations",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "CountryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Organizations_States_StateId",
                table: "Organizations",
                column: "StateId",
                principalTable: "States",
                principalColumn: "StateId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Organizations_Countries_CountryId",
                table: "Organizations");

            migrationBuilder.DropForeignKey(
                name: "FK_Organizations_States_StateId",
                table: "Organizations");

            migrationBuilder.DropIndex(
                name: "IX_Organizations_CountryId",
                table: "Organizations");

            migrationBuilder.DropIndex(
                name: "IX_Organizations_StateId",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "Organizations");
        }
    }
}
