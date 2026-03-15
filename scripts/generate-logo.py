"""
Crystallography.io Logo Generator
Generates SVG and PNG versions of the logo — an abstract molecular/crystal network
with interconnected atoms (nodes) and bonds (filled path shapes).

Design:
  - Orange accent nodes (#FB9B2B) — primary highlights
  - Blue accent nodes (#658DC6) — secondary highlights
  - White filled network paths — molecular bond structure
  - Transparent background (suitable for dark headers)

Usage:
  python scripts/generate-logo.py                    # Generate all assets
  python scripts/generate-logo.py --format svg       # SVG only
  python scripts/generate-logo.py --format png       # PNG only
  python scripts/generate-logo.py --output-dir ./out  # Custom output

Requirements:
  pip install cairosvg   # Only needed for PNG export
"""

import argparse
import os

# --- Design Constants ---

ORANGE = '#FB9B2B'
BLUE = '#658DC6'
WHITE = 'white'

# Each element: (path_d, fill_color)
# Coordinates in 40x40 viewBox space — extracted from the canonical logo design.
# Order matters: bonds (white filled shapes) first, then nodes on top.

ELEMENTS = [
    # --- Orange accent nodes (3) ---
    # Left-mid node
    (
        'M12.82 14.33C12.82 15.23 12.09 15.96 11.19 15.96'
        'C10.29 15.96 9.55 15.23 9.55 14.33'
        'C9.55 13.43 10.29 12.70 11.19 12.70'
        'C12.09 12.70 12.82 13.43 12.82 14.33Z',
        ORANGE,
    ),
    # Right-bottom node (main circle — blue)
    (
        'M28.51 28.19C29.96 28.19 31.13 27.02 31.13 25.56'
        'C31.13 24.11 29.96 22.94 28.51 22.94'
        'C27.05 22.94 25.88 24.11 25.88 25.56'
        'C25.88 27.02 27.05 28.19 28.51 28.19Z',
        BLUE,
    ),
    # Right-top node (rotated diamond shape)
    (
        'M26.93 1.69C27.20 1.36 27.60 1.15 28.03 1.11'
        'C28.08 1.11 28.13 1.11 28.18 1.11'
        'C28.56 1.11 28.93 1.24 29.23 1.49'
        'C29.56 1.77 29.76 2.16 29.81 2.60'
        'C29.84 3.03 29.71 3.46 29.43 3.79'
        'C28.85 4.48 27.82 4.57 27.13 3.99'
        'C26.79 3.71 26.59 3.32 26.55 2.88'
        'C26.51 2.45 26.64 2.02 26.93 1.69Z',
        ORANGE,
    ),

    # --- White structural nodes (3) ---
    # Bottom-left small node
    (
        'M13.59 26.33C14.18 26.33 14.66 26.81 14.66 27.40'
        'C14.66 27.99 14.18 28.47 13.59 28.47'
        'C13.00 28.47 12.52 27.99 12.52 27.40'
        'C12.52 26.81 13.00 26.33 13.59 26.33Z',
        WHITE,
    ),
    # Top-center node
    (
        'M15.42 0C16.32 0 17.06 0.73 17.06 1.63'
        'C17.06 2.54 16.32 3.27 15.42 3.27'
        'C14.52 3.27 13.79 2.54 13.79 1.63'
        'C13.79 0.73 14.52 0 15.42 0Z',
        WHITE,
    ),
    # Bottom-center node
    (
        'M20.20 38.92C20.05 39.33 19.75 39.66 19.35 39.85'
        'C18.96 40.03 18.51 40.05 18.10 39.90'
        'C17.25 39.59 16.82 38.65 17.12 37.81'
        'C17.43 36.96 18.37 36.52 19.22 36.83'
        'C19.63 36.98 19.96 37.28 20.14 37.68'
        'C20.33 38.07 20.35 38.51 20.20 38.92Z',
        WHITE,
    ),

    # --- White filled bond paths (11) — the molecular network ---
    (
        'M38.18 19.71C38.18 20.27 38.15 20.83 38.10 21.39'
        'C37.91 21.40 37.73 21.44 37.55 21.49'
        'C37.33 21.54 37.13 21.62 36.94 21.72'
        'L28.43 11.83C28.68 11.43 28.83 10.96 28.83 10.45'
        'C28.83 9.51 28.33 8.68 27.58 8.23'
        'L28.17 5.90C28.17 5.90 28.17 5.90 28.18 5.90'
        'C29.00 5.90 29.82 5.58 30.43 4.96'
        'C35.29 8.31 38.18 13.78 38.18 19.71Z',
        WHITE,
    ),
    (
        'M35.62 22.96C35.42 23.32 35.29 23.70 35.23 24.10'
        'L32.49 24.38C32.00 22.71 30.47 21.47 28.65 21.41'
        'L27.38 12.96L35.78 22.71'
        'C35.72 22.80 35.67 22.88 35.62 22.96Z',
        WHITE,
    ),
    (
        'M19.93 35.46C19.87 35.44 19.81 35.41 19.74 35.39'
        'C19.19 35.19 18.61 35.15 18.07 35.26'
        'L15.32 29.34C15.74 28.95 16.04 28.44 16.15 27.86'
        'L24.54 26.82C24.72 27.39 25.02 27.90 25.41 28.34'
        'L19.93 35.46Z',
        WHITE,
    ),
    (
        'M11.71 25.60L4.72 22.06C4.73 22.01 4.74 21.96 4.75 21.91'
        'C4.86 21.31 4.79 20.70 4.56 20.15'
        'L9.17 16.77C9.67 17.18 10.30 17.45 10.99 17.49'
        'L12.39 25.09C12.14 25.22 11.91 25.40 11.71 25.60Z',
        WHITE,
    ),
    (
        'M15.42 4.80C16.13 4.80 16.79 4.56 17.32 4.17'
        'L23.82 9.47C23.71 9.74 23.65 10.03 23.63 10.33'
        'L13.97 12.83C13.71 12.35 13.34 11.95 12.89 11.66'
        'L15.18 4.79C15.26 4.80 15.34 4.80 15.42 4.80Z',
        WHITE,
    ),
    (
        'M24.35 25.30L15.96 26.34'
        'C15.88 26.17 15.79 26.01 15.69 25.86'
        'L25.36 12.90C25.51 12.95 25.68 13.00 25.84 13.02'
        'L27.14 21.63C25.59 22.18 24.46 23.60 24.35 25.30Z',
        WHITE,
    ),
    (
        'M12.49 17.21C13.59 16.72 14.35 15.61 14.35 14.33'
        'C14.35 14.32 14.35 14.31 14.35 14.30'
        'L24.01 11.81C24.05 11.87 24.09 11.93 24.13 11.98'
        'L14.46 24.95C14.28 24.89 14.09 24.84 13.89 24.82'
        'L12.49 17.21Z',
        WHITE,
    ),
    (
        'M25.03 2.45C25.01 2.63 25.01 2.82 25.02 3.02'
        'C25.10 3.86 25.49 4.62 26.14 5.17'
        'C26.31 5.31 26.50 5.43 26.68 5.53'
        'L26.10 7.85C25.61 7.88 25.17 8.03 24.79 8.29'
        'L18.28 2.98C18.44 2.65 18.54 2.28 18.57 1.89'
        'C19.14 1.84 19.71 1.81 20.28 1.81'
        'C21.89 1.81 23.49 2.02 25.03 2.45Z',
        WHITE,
    ),
    (
        'M12.82 3.44C13.06 3.78 13.37 4.08 13.73 4.30'
        'L11.43 11.18C11.35 11.17 11.27 11.16 11.18 11.16'
        'C9.44 11.16 8.02 12.58 8.02 14.33'
        'C8.02 14.75 8.10 15.16 8.26 15.53'
        'L3.66 18.92C3.30 18.63 2.89 18.42 2.44 18.30'
        'C2.94 11.85 6.94 6.13 12.82 3.44Z',
        WHITE,
    ),
    (
        'M2.96 24.24C3.13 24.16 3.29 24.06 3.45 23.95'
        'C3.67 23.80 3.86 23.62 4.03 23.43'
        'L11.02 26.96C11.00 27.11 10.98 27.25 10.98 27.40'
        'C10.98 28.84 12.15 30.00 13.58 30.00'
        'C13.70 30.00 13.82 30.00 13.93 29.98'
        'L16.68 35.90C16.30 36.20 15.99 36.59 15.78 37.05'
        'C9.52 35.43 4.58 30.50 2.96 24.24Z',
        WHITE,
    ),
    (
        'M21.72 37.56C21.68 37.38 21.61 37.20 21.53 37.03'
        'C21.42 36.80 21.29 36.59 21.14 36.40'
        'L26.62 29.27C27.18 29.56 27.82 29.73 28.50 29.73'
        'C30.68 29.73 32.47 28.04 32.65 25.91'
        'L35.39 25.62C35.61 26.25 36.02 26.78 36.56 27.15'
        'C33.88 33.04 28.17 37.04 21.72 37.56Z',
        WHITE,
    ),

    # --- Blue accent nodes (3) ---
    # Center-right node
    (
        'M26.23 9.38C26.82 9.38 27.30 9.86 27.30 10.45'
        'C27.30 11.04 26.82 11.52 26.23 11.52'
        'C25.64 11.52 25.16 11.04 25.16 10.45'
        'C25.16 9.86 25.64 9.38 26.23 9.38Z',
        BLUE,
    ),
    # Far-left node
    (
        'M0.03 21.08C0.10 20.65 0.34 20.27 0.70 20.02'
        'C0.98 19.83 1.30 19.72 1.63 19.72'
        'C1.73 19.72 1.82 19.73 1.92 19.75'
        'C2.35 19.83 2.73 20.06 2.98 20.42'
        'C3.23 20.78 3.32 21.21 3.25 21.64'
        'C3.17 22.07 2.93 22.45 2.57 22.70'
        'C2.22 22.95 1.78 23.05 1.35 22.97'
        'C0.46 22.81 -0.13 21.96 0.03 21.08Z',
        BLUE,
    ),
    # Far-right node
    (
        'M39.78 25.36C39.56 25.74 39.21 26.01 38.79 26.12'
        'C38.37 26.24 37.93 26.18 37.55 25.96'
        'C37.17 25.74 36.90 25.39 36.79 24.97'
        'C36.67 24.55 36.73 24.11 36.95 23.73'
        'C37.17 23.35 37.52 23.08 37.94 22.97'
        'C38.08 22.93 38.23 22.91 38.37 22.91'
        'C38.65 22.91 38.93 22.99 39.18 23.13'
        'C39.56 23.35 39.83 23.70 39.94 24.13'
        'C40.06 24.54 40.00 24.98 39.78 25.36Z',
        BLUE,
    ),
]


def generate_svg(size: int = 40) -> str:
    """Generate the crystallography.io logo as SVG string."""
    lines = [
        f'<svg width="{size}" height="{size}" viewBox="0 0 40 40" '
        f'fill="none" xmlns="http://www.w3.org/2000/svg">'
    ]
    for path_d, fill in ELEMENTS:
        lines.append(f'<path d="{path_d}" fill="{fill}"/>')
    lines.append('</svg>')
    return '\n'.join(lines)



def save_svg(content: str, path: str) -> None:
    """Save SVG content to file."""
    with open(path, 'w') as f:
        f.write(content)
    print(f'  Generated: {path}')


def save_png(svg_content: str, path: str, size: int) -> None:
    """Convert SVG to PNG using cairosvg."""
    try:
        import cairosvg
    except ImportError:
        print(f'  Skipped: {path} (install cairosvg: pip install cairosvg)')
        return
    cairosvg.svg2png(
        bytestring=svg_content.encode('utf-8'),
        write_to=path,
        output_width=size,
        output_height=size,
    )
    print(f'  Generated: {path}')


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate crystallography.io logo assets')
    parser.add_argument('--format', choices=['svg', 'png', 'all'], default='all')
    parser.add_argument(
        '--output-dir',
        default=os.path.join(
            os.path.dirname(__file__),
            '..', 'packages', 'containers', 'c14-web', 'src', 'static',
        ),
    )
    args = parser.parse_args()

    out = os.path.abspath(args.output_dir)
    os.makedirs(out, exist_ok=True)

    print(f'Output directory: {out}')

    if args.format in ('svg', 'all'):
        save_svg(generate_svg(40), os.path.join(out, 'logo.svg'))

    if args.format in ('png', 'all'):
        for size in [48, 96, 192, 512]:
            svg = generate_svg(size)
            save_png(svg, os.path.join(out, f'icon-{size}.png'), size)

    print('Done.')


if __name__ == '__main__':
    main()
