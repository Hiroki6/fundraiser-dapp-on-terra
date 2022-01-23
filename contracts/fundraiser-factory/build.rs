extern crate protoc_rust;

use std::path::Path;
use protoc_rust::{Codegen, Customize};

fn main() {
    Codegen::new()
        .out_dir("src")
        .includes(&["src"])
        .input(Path::new("src/response.proto"))
        .customize(Customize {
            ..Default::default()
        })
        .run().expect("protoc");
}
