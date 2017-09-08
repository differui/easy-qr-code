/* eslint-disable import/prefer-default-export */
export function encodeOptimizedSVGDataUri(svgString) {
  const uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
    .replace(/%0A/g, '') // remove newlines
    .replace(/%20/g, ' ') // put spaces back in
    .replace(/%3D/g, '=') // ditto equals signs
    .replace(/%3A/g, ':') // ditto colons
    .replace(/%2F/g, '/') // ditto slashes
    .replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)

  return `data:image/svg+xml,${uriPayload}`;
}
