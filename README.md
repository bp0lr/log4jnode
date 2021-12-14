# log4jnode

Log4J RCE (CVE-2021-44228) vulnerability check from nodejs.

Just something quick and dirty for my internal tests.

```
Usage: index [options]

Options:
  -t, --target <type>       The target domain
  -c, --callbackDNS <type>  Your callback dns server
  -q, --query <type>        GET query
  --timeout <type>          Query timeout (default: "30000")
  --jndi <type>             Use a custom jndi payload (default: "jndi:ldap")
  -h, --help                display help for command
  ```