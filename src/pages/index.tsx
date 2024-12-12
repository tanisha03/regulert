import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Button, Select, List, Spin } from 'antd';
import { fetchAlertsFromAPI } from '@/utils/http';

const { Header, Content } = Layout;
const { Option } = Select;

const rssFeeds = [
  { name: 'RBI Press Releases', url: 'https://rbi.org.in/pressreleases_rss.xml' },
  { name: 'RBI Press Notifications', url: 'https://rbi.org.in/notifications_rss.xml' },
  { name: 'RBI Press Publications', url: 'https://rbi.org.in/Publication_rss.xml' },
  { name: 'SEBI', url: 'https://www.sebi.gov.in/sebirss.xml' },
  { name: 'Services India', url: 'https://services.india.gov.in/feed/rss?cat_id=10&ln=en' },
  { name: 'Tax', url: 'https://tax.cyrilamarchandblogs.com/feed/' },
];

const selectFeeds = [
  { name: 'RBI', value: 'RBI' },
  { name: 'SEBI', value: 'SEBI' },
  { name: 'Services India', value: 'Services India' },
  { name: 'Tax', value: 'Tax' },
];

export default function Home() {
  const [timeRange, setTimeRange] = useState('24h');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);

  const fetchAlerts = async () => {
    setLoading(true);
    const data = await fetchAlertsFromAPI(timeRange);
    if (data?.alerts?.length) {
      setAlerts(data?.alerts);
    } else {
      console.error('Error fetching alerts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, [timeRange]);

  // Handle filtering based on selected sources
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSources.length === 0) return true; // No filter applied
    if(selectedSources.includes('RBI')) {
      return alert.source?.includes('RBI')
    }
    return selectedSources.includes(alert.source);
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <h1 style={{ textAlign: 'center' }}>RegTech Alerts Dashboard</h1>
      </Header>
      <Content style={{ padding: '0 50px 50px 50px', marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, gap: 20 }}>
          <Select
            defaultValue={timeRange}
            onChange={(value) => setTimeRange(value)}
            style={{ width: 200 }}
          >
            <Option value="6h">Last 6 hours</Option>
            <Option value="12h">Last 12 hours</Option>
            <Option value="24h">Last 24 hours</Option>
          </Select>
          <Select
            mode="multiple"
            placeholder="Filter by source"
            style={{ width: 400 }}
            onChange={(value) => setSelectedSources(value)}
            value={selectedSources}
          >
            {selectFeeds.map((feed) => (
              <Option key={feed.name} value={feed.name}>
                {feed.name}
              </Option>
            ))}
          </Select>
        </div>

        <Spin spinning={loading} size="large">
          <List
            itemLayout="horizontal"
            dataSource={filteredAlerts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div>
                      <a href={item.link}>{item.title}</a>
                      <div style={{ fontWeight: 'normal' }}>{item.pubDate}</div> {/* Make date non-bold */}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ margin: '8px 0', color: '#888' }}>
                        {/* Assuming item.regulator is where the regulator info is stored */}
                        <strong>Regulator: </strong>{item.source || 'N/A'}
                      </div>
                      {/* Trim the content snippet */}
                      {item.contentSnippet
                        ? item.contentSnippet.length > 800
                          ? item.contentSnippet.substring(0, 800) + '...'
                          : item.contentSnippet
                        : ''}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Content>
    </Layout>
  );
}
