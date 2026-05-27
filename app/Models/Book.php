<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Override;

class Book extends Model
{
    use HasFactory; 

    protected $appends = ['discounted_price'];

    protected $fillable = [
        'category_id', 
        'title', 
        'pages',
        'author', 
        'description',
        'price', 
        'stock', 
        'cover_image',
        'discount_id', 
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function isAvailable(): bool
    {
        return $this->stock > 0;
    }

    public function discount()
    {
        
        return $this->belongsTo(Discount::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function watchlists()
    {
        return $this->hasMany(Watchlist::class);
    }
    
    public function getDiscountedPriceAttribute(): ?float
    {
        if (! $this->discount) {
            return null;
        }
        $percent = $this->discount->discount_percent;
        return round($this->price - ($this->price * ($percent / 100)), 2);
    }
}
