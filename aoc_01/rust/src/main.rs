use std::fs;

fn main() {
    let input = fs::read_to_string("../input.txt").expect("Something went wrong reading the file");

    let food_per_elf: Vec<Vec<i32>> = input
        .split("\n\n")
        .map(|x| x.lines().map(|x| x.parse::<i32>().unwrap()).collect())
        .collect();

    let mut cals_per_elf: Vec<i32> = food_per_elf.iter().map(|x| x.iter().sum()).collect();
    cals_per_elf.sort_by(|a, b| b.cmp(a));

    println!("part1: {}", cals_per_elf[0]);
    println!("part2: {}", cals_per_elf[0..3].iter().sum::<i32>());
}
