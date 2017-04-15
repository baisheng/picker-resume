export default [
    [/^admin\/login$/, "admin/user/login"],
    [/^admin\/logout$/, "/admin/user/logout"],
    [/^admin\/(\w+)\/(\d+)?$/, "admin/posts/:1?id=:2"],
    [/^admin\/resume\/(\d+)?$/, "admin/posts/resume?id=:1"],
    [/^admin\/posts\/(\d+)\/(\w+)$/, "admin/posts/:2?id=:1"],

    [/^admin\/post\/(\w+)\/(\w+)\/?(\d+)?$/, "admin/posts/:2?type=:1&id=:3"],


];