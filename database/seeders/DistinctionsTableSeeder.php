<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistinctionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $distinctions = [
            [
                'name' => 'YOUNG MENTOR',
                'description' => 'This distinction rewards you with a 4% bonus on the first referral level, 2% on the second level, and 1% on the third and fourth levels.',
                'min_icoin' => 0,
                'percentage_1' => 4,
                'percentage_2' => 2,
                'percentage_3' => 1,
                'percentage_4' => 1,
                'training_access' => null,
            ],
            [
                'name' => 'MENTOR GOLD',
                'description' => 'To obtain this distinction, you must complete the first genealogy and accumulate a minimum of 30 I-Coin.',
                'min_icoin' => 30,
                'percentage_1' => 4,
                'percentage_2' => 2,
                'percentage_3' => 1,
                'percentage_4' => 1,
                'training_access' => null,
            ],
            [
                'name' => 'LEADER MASTER',
                'description' => 'By achieving this distinction, you must have completed the second genealogy and collected at least 2000 I-Coin.',
                'min_icoin' => 2000,
                'percentage_1' => 5,
                'percentage_2' => 2,
                'percentage_3' => 1,
                'percentage_4' => 1,
                'training_access' => 'GENIUS',
            ],
            [
                'name' => 'LEADER COMMANDER',
                'description' => 'This distinction is awarded to members who have completed the third genealogy and accumulated a minimum of 10,000 I-Coin.',
                'min_icoin' => 10000,
                'percentage_1' => 5,
                'percentage_2' => 3,
                'percentage_3' => 1,
                'percentage_4' => 1,
                'training_access' => 'APPOLON TRADER',
            ],
            [
                'name' => 'DIAMOND TOP LEADER',
                'description' => 'To become a Diamond Top Leader, you must have completed the fourth genealogy and accumulated at least 20,000 I-Coin.',
                'min_icoin' => 20000,
                'percentage_1' => 6,
                'percentage_2' => 2,
                'percentage_3' => 1,
                'percentage_4' => 1,
                'training_access' => 'ZEUS TRADER PRO',
            ],
        ];

        foreach ($distinctions as $distinction) {
            DB::table('distinctions')->insert($distinction);
        }
    }
}
