/**
 * <PlacePage>: static place page.
 */
import * as React from 'react';
import {Fragment} from 'react';
import {POI, Map} from '../contentTypes';
import {Layout} from './Layout';
import {getLanguageVersionURLs} from '../generator/util';
import _ from '../l10n';
import {ssrComponent} from './ssrComponent';
import {Content} from '../components/Content';

export interface PlacePageProps {
    lang: string;
    bundlePath: string;
    cssPath?: string;
    poi: POI;
    map: Map;
}

export const PlacePage = (props: PlacePageProps) => {
    const {lang, bundlePath, cssPath, poi, map} = props;

    return <Layout
        title={poi.data.title}
        lang={lang}
        bundlePath={bundlePath}
        cssPath={cssPath}
        languageVersions={getLanguageVersionURLs(poi.name, 'pois')}
        bodyClass="body-poi"
        activeHeaderLink="pois"
    >
        <main>
            <div className="poi-logo">
                {poi.data.customIcon ? <img className="custom-icon" src={poi.data.customIcon} height="80" /> : null}
            </div>
            <h1 className="poi-title">{poi.data.title}</h1>
            <p className="poi-subtitle">{poi.data.subtitle
                ? `${_(`type-${poi.data.type}`, lang)} &bullet; ${poi.data.subtitle}`
                : _(`type-${poi.data.type}`, lang)}</p>
            <hr />
            <div className="poi-description">
                {poi.galleryPrepared && ssrComponent('reactImageGallery', {
                    items: poi.galleryPrepared,
                    showPlayButton: false,
                    showIndex: true,
                    showBullets: true,
                })}
                {poi.data.description && <h2 dangerouslySetInnerHTML={{__html: poi.data.description}} />}
            </div>
            <aside className="poi-map-and-data">
                {ssrComponent('miniMapView', {lang, poiData: poi.data, mapData: map.data, geoJSONs: poi.geoJSONs})}
                <p>
                    {poi.data.seasonDescription &&
                    <><b>{_('Season', lang)}</b>: <span dangerouslySetInnerHTML={{__html: poi.data.seasonDescription}} /><br/></>}
                    {poi.data.accessDescription &&
                    <><b>{_('Access', lang)}</b>: <span dangerouslySetInnerHTML={{__html: poi.data.accessDescription}} /><br/></>}
                    {poi.data.more && <>
                        {Object.keys(poi.data.more).map(item => <Fragment key={item}>
                            <b>{_(item, lang)}</b>: <span dangerouslySetInnerHTML={{__html: poi.data.more![item]}} /><br/>
                        </Fragment>)}
                    </>}
                </p>
                {poi.data.externalLinks && <>
                    <p><b>{_('Links', lang)}:</b></p>
                    <ul>
                        {Object.keys(poi.data.externalLinks).map(title => <li key={title}><a href={poi.data.externalLinks![title]}>{title}</a></li>)}
                    </ul>
                </>}
            </aside>
            <article className="poi-main">
                <hr />
                <Content content={poi.content} lang={lang} />
                {poi.data.updated && <p><i>{_('Up to date as of', lang)}: {poi.data.updated}</i></p>}
            </article>
        </main>
    </Layout>;
}
