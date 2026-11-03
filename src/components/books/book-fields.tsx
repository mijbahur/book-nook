import { BOOK_CATEGORIES, type Book, type BookCategory } from "@/lib/types";

export const bookFieldClassName =
    "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

export type BookFormValues = {
    title: string;
    author: string;
    category: BookCategory | "";
    image: string;
    description: string;
    totalCopies: string;
};

export const emptyBookForm: BookFormValues = {
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
    totalCopies: "1",
};

export function bookFormFromBook(book: Book): BookFormValues {
    return {
        title: book.title,
        author: book.author,
        category: book.category,
        image: book.image,
        description: book.description,
        totalCopies: String(book.totalCopies ?? 1),
    };
}

type BookFieldsProps = {
    idPrefix: string;
    values: BookFormValues;
    onChange: <K extends keyof BookFormValues>(
        field: K,
        value: BookFormValues[K],
    ) => void;
    disabled?: boolean;
};

export function BookFields({
    idPrefix,
    values,
    onChange,
    disabled = false,
}: BookFieldsProps) {
    const id = (name: string) => `${idPrefix}-${name}`;

    return (
        <>
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium" htmlFor={id("title")}>
                    Book Title
                    <input
                        className={bookFieldClassName}
                        id={id("title")}
                        type="text"
                        autoComplete="off"
                        maxLength={160}
                        placeholder="Enter the book title"
                        value={values.title}
                        onChange={(event) =>
                            onChange("title", event.target.value)
                        }
                        disabled={disabled}
                        required
                    />
                </label>

                <label className="text-sm font-medium" htmlFor={id("author")}>
                    Author Name
                    <input
                        className={bookFieldClassName}
                        id={id("author")}
                        type="text"
                        autoComplete="off"
                        maxLength={120}
                        placeholder="Enter the author's name"
                        value={values.author}
                        onChange={(event) =>
                            onChange("author", event.target.value)
                        }
                        disabled={disabled}
                        required
                    />
                </label>

                <label className="text-sm font-medium"  htmlFor={id("category")}>
                    Category
                    <select
                        className={bookFieldClassName}
                        id={id("category")}
                        value={values.category}
                        onChange={(event) =>
                            onChange(
                                "category",
                                event.target.value as BookCategory,
                            )
                        }
                        disabled={disabled}
                        required
                    >
                        <option value="" disabled>
                            Choose a category
                        </option>
                        {BOOK_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm font-medium" htmlFor={id("copies")}>
                    Copies Available
                    <input
                        className={bookFieldClassName}
                        id={id("copies")}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={999}
                        step={1}
                        value={values.totalCopies}
                        onChange={(event) =>
                            onChange("totalCopies", event.target.value)
                        }
                        disabled={disabled}
                        required
                    />
                </label>

                <label
                    className="text-sm font-medium sm:col-span-2"
                    htmlFor={id("image")}
                >
                    Book Image URL
                    <input
                        className={bookFieldClassName}
                        id={id("image")}
                        type="url"
                        placeholder="https://example.com/cover.jpg"
                        value={values.image}
                        onChange={(event) =>
                            onChange("image", event.target.value)
                        }
                        disabled={disabled}
                        required
                    />
                </label>
            </div>

            <label className="block text-sm font-medium" htmlFor={id("description")}>
                Short Description
                <textarea
                    className={`${bookFieldClassName} min-h-28 resize-y`}
                    id={id("description")}
                    maxLength={500}
                    placeholder="What should readers know about this book?"
                    value={values.description}
                    onChange={(event) =>
                        onChange("description", event.target.value)
                    }
                    disabled={disabled}
                    required
                />
            </label>
        </>
    );
}
