import { useEffect, useState } from 'react';
import { Layout, Select, List, Spin, DatePicker, Input, Row, Col } from 'antd';
import { fetchAlertsFromAPI } from '@/utils/http';

const { Header, Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const selectFeeds = [
  { name: 'RBI', value: 'RBI' },
  { name: 'SEBI', value: 'SEBI' },
  { name: 'Services India', value: 'Services India' },
  { name: 'Tax', value: 'Tax' },
  { name: 'MCA', value: 'MCA' },
  { name: 'ITR', value: 'ITR' },
  { name: 'BSE', value: 'BSE' },
  { name: 'FSSAI', value: 'FSSAI' },
  { name: 'Directorate of Enforcement', value: 'Directorate of Enforcement' },
  { name: 'Central Board Of Indirect Taxes & Customs', value: 'Central Board Of Indirect Taxes & Customs' },
  { name: 'DGFT', value: 'DGFT' },
  { name: 'CBDT', value: 'CBDT' },
];

export default function Home() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [titleFilter, setTitleFilter] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAlertsFromAPI();
      if (data?.length) {
        setAlerts(data);
      } else {
        console.error('Error fetching alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // useEffect to filter alerts based on selected sources and date range
  useEffect(() => {
    const filterAlerts = () => {
      const filtered = alerts.filter((alert) => {
        // Filter based on date range
        const pubDate = new Date(alert.pubDate).getTime();

        const isInDateRange =
        (dateRange?.[0] && dateRange?.[1]) ? (pubDate >= new Date(dateRange[0].startOf('day')).getTime() && pubDate <= new Date(dateRange[1].endOf('day')).getTime()) : true;

        // Filter based on selected sources
        const isInSelectedSources =
          selectedSources.length === 0 || selectedSources.includes(alert.source);

        const titleFilterCheck = titleFilter?.length ? alert?.title?.toLowerCase()?.includes(titleFilter?.toLowerCase()) || alert?.contentSnippet?.toLowerCase()?.includes(titleFilter?.toLowerCase()) : true;

        return isInDateRange && isInSelectedSources && titleFilterCheck;
      }).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      setFilteredAlerts(filtered);
    };

    // Only filter if alerts are available and selectedFilters have changed
    if (alerts.length) {
      filterAlerts();
    }
  }, [alerts, selectedSources, dateRange, titleFilter]); // Dependency array includes alerts, selectedSources, and dateRange

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <h1 style={{ textAlign: 'center' }}>RegTech Alerts Dashboard</h1>
      </Header>
      <Content style={{ padding: '0 50px 50px 50px', marginTop: 20 }}>
      <div className="header-content" style={{ width: '100%' }}>
        <Row gutter={[16, 16]} justify="center" align="middle">
          {/* Date Range Picker */}
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
          </Col>

          {/* Filter by source */}
          <Col xs={24} sm={12} md={8}>
            <Select
              mode="multiple"
              placeholder="Filter by source"
              style={{ width: '100%' }}
              onChange={(value) => setSelectedSources(value)}
              value={selectedSources}
            >
              {selectFeeds.map((feed) => (
                <Option key={feed.name} value={feed.name}>
                  {feed.name}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Search Input */}
          <Col xs={24} sm={12} md={8}>
            <Input
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search..."
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
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
                      <div style={{ fontWeight: 'normal' }}>{new Date(item.pubDate)?.toDateString()}</div> {/* Make date non-bold */}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ margin: '8px 0', color: '#888' }}>
                        <strong>Regulator: </strong>{item.source || 'N/A'}
                      </div>
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
