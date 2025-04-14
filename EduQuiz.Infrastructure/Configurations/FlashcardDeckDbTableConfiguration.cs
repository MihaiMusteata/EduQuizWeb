using EduQuiz.Domain.Entities.FlashcardDeck;
using EduQuiz.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduQuiz.Infrastructure.Configurations;

public class FlashcardDeckDbTableConfiguration : IEntityTypeConfiguration<FlashcardDeckDbTable>
{
    public void Configure(EntityTypeBuilder<FlashcardDeckDbTable> builder)
    {
        builder.ToTable("FlashcardDecks");

        builder.HasKey(deck => deck.Id);

        builder.Property(deck => deck.Id)
            .ValueGeneratedOnAdd();

        builder.Property(deck => deck.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(deck => deck.CreatedAt)
            .IsRequired();

        builder.Property(deck => deck.Visibility)
            .IsRequired()
            .HasConversion(
                v => v.Value,
                v => Visibility.FromString(v)
            );

        builder.HasMany(deck => deck.Flashcards)
            .WithOne(flashcard => flashcard.FlashcardDeck)
            .HasForeignKey(flashcard => flashcard.FlashcardDeckId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(q => q.User)
            .WithMany(u => u.FlashcardDecks)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}