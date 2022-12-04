use itertools::Itertools;
use std::fs;

fn main() {
    let input = fs::read_to_string("../input.txt").unwrap();
    let pairs_iter = input.lines().map(|line| {
        line.split(',')
            .map(|assignment| {
                assignment
                    .split("-")
                    .collect_tuple::<(&str, &str)>()
                    .map(|(l, r)| (l.parse::<i32>().unwrap(), r.parse::<i32>().unwrap()))
                    .unwrap()
            })
            .collect_tuple()
            .unwrap()
    });

    // Part 1
    let full_overlaps = pairs_iter
        .clone()
        .filter(|pair| {
            let (l, r) = pair;
            fully_contained(*l, *r)
        })
        .count();
    println!("full_overlaps: {:?}", full_overlaps);

    // Part 2
    let any_overlaps = pairs_iter
        .filter(|pair| {
            let (l, r) = pair;
            overlaps(*l, *r)
        })
        .count();
    println!("any_overlaps: {:?}", any_overlaps);
}

fn is_between(n: i32, tup: (i32, i32)) -> bool {
    let (start, end) = tup;
    n >= start && n <= end
}

fn fully_contained(l_tup: (i32, i32), r_tup: (i32, i32)) -> bool {
    let (l_start, l_end) = l_tup;
    let (r_start, r_end) = r_tup;
    (is_between(l_start, r_tup) && is_between(l_end, r_tup))
        || (is_between(r_start, l_tup) && is_between(r_end, l_tup))
}

fn overlaps(l_tup: (i32, i32), r_tup: (i32, i32)) -> bool {
    let (l_start, l_end) = l_tup;
    let (r_start, r_end) = r_tup;
    is_between(l_start, r_tup)
        || is_between(l_end, r_tup)
        || is_between(r_start, l_tup)
        || is_between(r_end, l_tup)
}
