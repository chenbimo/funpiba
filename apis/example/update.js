// 工具函数
import { fnRoute, fnSchema, appConfig } from 'yiapi';
// 配置文件
// 数据库表
import { tableData } from '../../tables/example.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema('id'),
                nickname: fnSchema(tableData.nickname),
                age: fnSchema(tableData.age)
            },
            required: ['id']
        },

        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const newsModel = fastify.mysql.table('news');

                const result = await newsModel //
                    .clone()
                    .where('id', req.body.id)
                    .updateData({
                        title: req.body.title,
                        thumbnail: req.body.thumbnail,
                        content: req.body.content
                    });

                return {
                    ...appConfig.http.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.http.INSERT_FAIL;
            }
        }
    });
};
