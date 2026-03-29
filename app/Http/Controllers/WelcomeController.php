<?php

namespace App\Http\Controllers;

use App\Models\Book;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Psy\Readline\Hoa\Console;

class WelcomeController extends Controller{   
    public function index()
{
    $books = Book::with('category')
        ->withSum('orderItems as times_sold', 'quantity')
        ->orderByDesc('times_sold')
        ->get()
        ->filter(fn ($book) => (int) ($book->times_sold ?? 0) >= 10)
        ->take(8)
        ->values()
        ->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'price' => $book->price,
                'times_sold' => $book->times_sold ?? 0,
                'image_url' => $book->cover_image 
                    ? asset('storage/' . $book->cover_image) 
                    : '/images/no-book.png',
                'category_name' => $book->category?->name ?? 'General',
                'is_best_seller' => ($book->times_sold ?? 0) >= 10,
            ];
        });

    return Inertia::render('Welcome', [
        'bestSellers' => $books,
    ]);
}
}


