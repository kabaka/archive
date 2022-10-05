import * as React from 'react';
import * as shiki from 'shiki';
import {
  useEffect,
  useState,
} from 'react';
import { IArchiveRecord } from 'archive-types';

interface TxtRendererProps {
  record: IArchiveRecord;
}

shiki.setCDN('/static/shiki/');

export const TxtRenderer: React.FunctionComponent<TxtRendererProps> = (props: TxtRendererProps) => {
  const { record } = props;
  const [ data, setData ] = useState('Loading...');

  const updateData = () => {
    (async () => {
      try {
        const result = await record.data;

        shiki.getHighlighter({ theme: 'nord' }).then((highlighter) => {
          setData(highlighter.codeToHtml(result.toString(), { lang: 'js' }));
        }).catch((err) => alert(err));
      } catch (err) {
        alert(err);
      }
    })();
  };

  useEffect(updateData, [ record ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(updateData, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};
