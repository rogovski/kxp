
#!/bin/bash
# -p 5672:5672
docker run -i --rm --hostname bushost -p 5672:5672 --name bus rabbitmq:3
