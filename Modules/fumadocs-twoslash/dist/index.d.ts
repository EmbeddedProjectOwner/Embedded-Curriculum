import { ShikiTransformer } from 'shiki';
import { TransformerTwoslashIndexOptions } from '@shikijs/twoslash';

declare function transformerTwoslash(options?: TransformerTwoslashIndexOptions): ShikiTransformer;

export { transformerTwoslash };
