<?php

namespace App\Http\Controllers;

use App\Models\Watchlist;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WatchlistController extends Controller
{
    public function index()
    {
        $watchlists = Watchlist::with('book')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Customer/Watchlist/Index', [
            'watchlists' => $watchlists,
        ]);
    }

    public function store(Book $book)
    {
        Watchlist::firstOrCreate([
            'user_id' => Auth::id(),
            'book_id' => $book->id,
        ]);

        return back()->with('success', 'Added to watch list');
    }

    public function destroy(Book $book)
    {
        Watchlist::where('user_id', Auth::id())
            ->where('book_id', $book->id)
            ->delete();

        return back()->with('success', 'Removed from watch list');
    }
}
