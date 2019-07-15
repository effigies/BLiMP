import * as React from 'react';
import { Button, Card, Skeleton } from 'antd';
import { config } from '../config';
import { jwtFetch } from '../utils';
import '../css/Bibliography.css';

const domainRoot = config.server_url;
const ButtonGroup = Button.Group;

type bibProps = {
  analysisId?: string,
};

interface BibState {
  tools: any[];
  data: any[];
  extractors: any[];
  csl_json: any[];
  bibLoaded: boolean;
}

class RefList extends React.Component<{refs: any[]}, {}> {
  render() {
    let items = this.props.refs.map((item, key) =>
      <div className={'bibStyle'} key={key}  dangerouslySetInnerHTML={{__html: item}} />
    );

    return(
      <div>
        {items}
      </div>
    );
  }
}

class DownloadButton extends React.Component<{data: any[], title: string, filename: string}, {}> {
  render() {
    let data = this.props.data;
    let formatted = 'data: text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    return(
      <a href={formatted} download={this.props.filename}>
        <Button type="primary" icon="download">{this.props.title}</Button>
      </a>
    );
  }
}

export class BibliographyTab extends React.Component<bibProps, BibState> {
  constructor(props) {
    super(props);
    let state: BibState = {
      tools: [],
      data: [],
      extractors: [],
      csl_json: [],
      bibLoaded: false,
    };
    this.state = state;
  }

  loadBib = (): void => {
    let id = this.props.analysisId;
    let url = `${domainRoot}/api/analyses/${id}/bibliography`;
    let state = {...this.state};
    jwtFetch(url, { method: 'GET' })
    .then((res) => {
      state.tools = res.tools;
      state.data = res.data;
      state.extractors = res.extractors;
      state.csl_json = res.csl_json;
      state.bibLoaded = true;
      this.setState({...state});
    });
  };

  componentDidMount() {
    if (this.state.bibLoaded === false) {
      this.loadBib();
    }
  }

  render() {
    let merged = this.state.data.concat(this.state.tools, this.state.extractors);
    return(
      <div>
          <p>
            Below are the references for the tools, data, and extractors used in this analysis.
            Be sure to cite these references if you publish any results stemming from this analysis.
          </p>
          <Card title="Dataset">
          <Skeleton loading={this.state.bibLoaded === false}>
            {this.state.data && <RefList refs={this.state.data}/>}
          </Skeleton>
          </Card>
          <br/>
          <Card title="Scientific Software">
          <Skeleton loading={this.state.bibLoaded === false}>
            {this.state.tools && <RefList refs={this.state.tools}/>}
          </Skeleton>
          </Card>
          <br/>
          <Card title="Feature Extractors">
          <Skeleton loading={this.state.bibLoaded === false}>
            {this.state.extractors && <RefList refs={this.state.extractors}/>}
          </Skeleton>

          </Card>
          <br/>

          <Card title="Export All" bordered={false} style={{ width: 400 }}>
          <ButtonGroup>
            <DownloadButton
              data={merged}
              title="HTML - APA"
              filename={this.props.analysisId + '_refs.html'}
            />
            <DownloadButton
              data={this.state.csl_json}
              title="CSL - JSON"
              filename={this.props.analysisId + '_refs.json'}
            />
          </ButtonGroup>
          </Card>
      </div>
    );
  }
}
