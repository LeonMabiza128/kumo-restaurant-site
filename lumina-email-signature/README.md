# Lumina email signature (design 1)

Ready-to-use signatures for Chesney and Siya.

- `chesney-signature.html`, `siya-signature.html`: the signatures. Name, title, phone, email and website are live text (sharp, clickable, editable). Only the avatar, icons, logo and banner are images.
- `images/`: the hosted images, rendered at 3x for sharp display on high-resolution screens.
- `exports/`: each full signature as a single 3x PNG (1800 px wide), for places that only accept an image.

## Live image URLs

The HTML loads its images from these public URLs. They are pinned to a fixed commit, so they will not change:

| Image | URL |
|---|---|
| Banner (1800 x 450) | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/banner-build-stronger-teams.png |
| Logo | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/lumina-logo-navy.png |
| Chesney avatar | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/avatar-chesney.png |
| Siya avatar | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/avatar-siya.png |
| Phone icon | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/icon-phone-blue.png |
| Email icon | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/icon-mail-blue.png |
| Website icon | https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/lumina-email-signature/images/icon-globe-blue.png |

CDN alternative (same files): replace `https://raw.githubusercontent.com/leonmabiza128/kumo-restaurant-site/583dc5d.../` with `https://cdn.jsdelivr.net/gh/leonmabiza128/kumo-restaurant-site@583dc5dc7bfe1ac7420f4724d3ab4c7c7e5bfa12/`.

## Install

1. Open the signature HTML file in Chrome.
2. Select everything (Ctrl+A or Cmd+A) and copy (Ctrl+C or Cmd+C).
3. Gmail: Settings > See all settings > General > Signature > Create new > paste > Save changes.
   Outlook (web): Settings > Mail > Compose and reply > Email signature > paste > Save.
   Outlook (desktop): File > Options > Mail > Signatures > New > paste.
4. Send a test email to yourself and open it on a phone and a laptop.

## Moving the images later

When the lumina-advance.co.za site can host files, upload the `images` folder there and replace the image base URL in both HTML files.
