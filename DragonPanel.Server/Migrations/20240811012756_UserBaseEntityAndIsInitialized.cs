using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DragonPanel.Server.Migrations
{
    /// <inheritdoc />
    public partial class UserBaseEntityAndIsInitialized : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<bool>(
                name: "is_initial",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_at",
                table: "users");

            migrationBuilder.DropColumn(
                name: "is_initial",
                table: "users");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "users");
        }
    }
}
