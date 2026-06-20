using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ActionName",
                table: "Actions",
                newName: "ActionTitle");

            migrationBuilder.AddColumn<string>(
                name: "ActionDescription",
                table: "Actions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActionDescription",
                table: "Actions");

            migrationBuilder.RenameColumn(
                name: "ActionTitle",
                table: "Actions",
                newName: "ActionName");
        }
    }
}
