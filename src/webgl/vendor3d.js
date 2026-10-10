/**
 * Single entry point for three.js. The supplied source loaded a self-hosted esbuild bundle
 * (a self-hosted bundle) that was NOT part of the supplied archive; it is replaced by the npm `three` package.
 * `three/webgpu` ships WebGPURenderer with automatic WebGL2 fallback and the node materials used by the lobby chroma-key.
 */
import * as THREE from 'three/webgpu';
import {texture as tslTexture, float as tslFloat, vec3 as tslVec3} from 'three/tsl';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';

export {THREE, tslTexture, tslFloat, tslVec3, GLTFLoader, RGBELoader, MeshoptDecoder};
