from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .scaffold import InitResult, init_palprompt_structure, refresh_prompts


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="palprompt", description="palprompt CLI for managing pal/ workflows"
    )
    subparsers = parser.add_subparsers(dest="command")

    init_parser = subparsers.add_parser(
        "init", help="Initialise pal/ directory structure and prompt templates"
    )
    init_parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing pal/ directory if present",
    )
    init_parser.add_argument(
        "--path",
        type=Path,
        default=Path.cwd(),
        help="Target project directory (default: current working directory)",
    )

    update_parser = subparsers.add_parser(
        "update", help="Refresh prompt templates and sync assistant directories"
    )
    update_parser.add_argument(
        "--path",
        type=Path,
        default=Path.cwd(),
        help="Target project directory (default: current working directory)",
    )
    return parser


def cmd_init(args: argparse.Namespace) -> int:
    result: InitResult = init_palprompt_structure(root=args.path, force=args.force)

    if result.existing and not args.force:
        print(
            f"pal/ already exists at {args.path.resolve()}. "
            "Use --force to regenerate.",
            file=sys.stderr,
        )
        return 1

    print(
        f"palprompt init complete at {result.root.resolve()} "
        f"(created: {', '.join(sorted(result.created)) or 'none'}, "
        f"migrated: {', '.join(sorted(result.migrated)) or 'none'})"
    )
    return 0


def cmd_update(args: argparse.Namespace) -> int:
    try:
        updated = refresh_prompts(root=args.path)
    except FileNotFoundError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    print(
        f"palprompt update complete at {(args.path / 'pal').resolve()} "
        f"(updated: {', '.join(sorted(updated)) or 'none'})"
    )
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "init":
        return cmd_init(args)
    if args.command == "update":
        return cmd_update(args)

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
