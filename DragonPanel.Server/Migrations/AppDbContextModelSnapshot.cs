﻿// <auto-generated />
using System;
using DragonPanel.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DragonPanel.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DragonPanel.Server.Auth.Model.Session", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<bool>("IsValid")
                        .HasColumnType("boolean")
                        .HasColumnName("is_valid");

                    b.Property<DateTime>("LastAccess")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("last_access");

                    b.Property<string>("LastIp")
                        .HasColumnType("text")
                        .HasColumnName("last_ip");

                    b.Property<string>("LastUserAgent")
                        .HasColumnType("text")
                        .HasColumnName("last_user_agent");

                    b.Property<string>("LoggedInIp")
                        .HasColumnType("text")
                        .HasColumnName("logged_in_ip");

                    b.Property<string>("LoggedInIpAddress")
                        .HasColumnType("text")
                        .HasColumnName("logged_in_ip_address");

                    b.Property<string>("UserAgent")
                        .HasColumnType("text")
                        .HasColumnName("user_agent");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_sessions");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_sessions_user_id");

                    b.ToTable("sessions", (string)null);
                });

            modelBuilder.Entity("DragonPanel.Server.Auth.Model.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<bool>("Disabled")
                        .HasColumnType("boolean")
                        .HasColumnName("disabled");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("display_name");

                    b.Property<string>("Email")
                        .HasColumnType("text")
                        .HasColumnName("email");

                    b.Property<string>("HashedPassword")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("hashed_password");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("boolean")
                        .HasColumnName("is_admin");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("username");

                    b.HasKey("Id")
                        .HasName("pk_users");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("DragonPanel.Server.Auth.Model.Session", b =>
                {
                    b.HasOne("DragonPanel.Server.Auth.Model.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_sessions_users_user_id");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
