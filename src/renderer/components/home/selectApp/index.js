import React, { Component } from "react";
import {
  getApks,
  getPackages,
  onSelectAPK,
  onSelectPackage,
  record
} from "../lib";
import { Icon, Button, Upload, Spin } from "antd";
// @ts-ignore
import styles from "../selectApp/app.css";
import { connect } from "dva";
// @ts-ignore
const default_icon = require("../../../../../static/images/default_app_icon.png");
let apks = [];
getApks(({ _apks }) => (apks = _apks));

class APP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      select: null,
      className: ""
      // loading: true
    };
    // emitter.on("packages", packages => {
    //   this.setState({ packages, loading: false });
    // });
  }
  selectApp(app, type) {
    type === "phone" ? onSelectPackage(app) : onSelectAPK(app);
    this.setState({ select: app, className: app.name + type });
  }
  render() {
    return (
      <Spin
        size="large"
        tip="加载应用列表..."
        spinning={!this.props.record.packages}
      >
        <div className={styles["select-app-wrap"]}>
          <div className={styles["title-list"]}>
            <Icon type="mobile" />
            <p>选择手机中的应用</p>
            <Button
              className={styles["refresh-btn"]}
              shape="circle"
              icon="reload"
              size={"small"}
              onClick={() => {
                this.props.dispatch({
                  type: "record/packages",
                  payload: {
                    packages: null
                  }
                });
                getPackages(this.props.dispatch);
              }}
            />
            <Button
              className={styles["app-control-btn"]}
              type="primary"
              disabled={this.state.select ? false : true}
              onClick={() => {
                this.props.dispatch({
                  type: "record/start"
                });
                record();
                this.props.recording();
              }}
            >
              开始录制
            </Button>
          </div>
          <div className={styles["app-list-wrap"]}>
            {this.props.record.packages &&
              this.props.record.packages.map((app, index) => {
                return (
                  <div
                    className={
                      this.state.className === app.name + "phone"
                        ? "app-item selected"
                        : styles["app-item"]
                    }
                    key={index}
                    onClick={this.selectApp.bind(this, app, "phone")}
                  >
                    <div className={styles["app-item-mask"]}>
                      <Icon
                        type="check"
                        style={{ fontSize: 32, color: "#52c41a" }}
                      />
                    </div>
                    <div className={styles["app-item-icon"]}>
                      <img src={app.icon || default_icon} alt="" />
                    </div>
                    <p className={styles["app-item-name"]} title={app.name}>
                      {app.name}
                    </p>
                  </div>
                );
              })}
          </div>
          <div className={styles["title-list"]}>
            <Icon type="laptop" />
            <p>选择电脑上的应用</p>
          </div>
          <div className={styles["app-list-wrap"]}>
            {apks &&
              apks.map((app, index) => {
                return (
                  <div
                    className={
                      this.state.className === app.name + "local"
                        ? "app-item selected"
                        : "app-item"
                    }
                    key={index}
                    onClick={this.selectApp.bind(this, app, "local")}
                  >
                    <div className={styles["app-item-mask"]}>
                      <Icon
                        type="check"
                        style={{ fontSize: 32, color: "#52c41a" }}
                      />
                    </div>
                    <div className={styles["app-item-icon"]}>
                      <img src={app.icon || default_icon} alt="" />
                    </div>
                    <p className={styles["app-item-name"]} title={app.name}>
                      {app.name}
                    </p>
                  </div>
                );
              })}
            <div className={styles["app-item"]}>
              <div className={styles["app-item-icon item-uploader"]}>
                <Upload
                  {...{
                    beforeUpload: () => false
                  }}
                  onChange={evt => {
                    console.log(evt);
                    this.selectApp(evt.file, "local");
                  }}
                >
                  <Button>
                    <Icon type="upload" />
                  </Button>
                </Upload>
              </div>
              <p className={styles["app-item-name"]}>选择APK上传</p>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(state => state)(APP);
