import { type ImageProps } from 'next/image';
import { type ImgHTMLAttributes } from 'react';
import './image-zoom.css';
import { type UncontrolledProps } from 'react-medium-image-zoom';
export type ImageZoomProps = ImageProps & {
    /**
     * Image props when zoom in
     */
    zoomInProps?: ImgHTMLAttributes<HTMLImageElement>;
    /**
     * Props for `react-medium-image-zoom`
     */
    rmiz?: UncontrolledProps;
};
export declare function ImageZoom({ zoomInProps, children, rmiz, ...props }: ImageZoomProps): React.ReactElement;
//# sourceMappingURL=image-zoom.d.ts.map